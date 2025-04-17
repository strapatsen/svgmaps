export class SafetyRuleManager {
    constructor() {
        this.countryPresets = {};
        this.currentRules = {
            countryCode: 'NL',
            rules: {},
            customRules: {}
        };
        this.registerDefaultPresets();
    }

    registerDefaultPresets() {
        this.registerCountryPreset('NL', {
            medical: {
                minFirstAidPosts: 1,
                staffPerAttendees: 1/750,
                coverageArea: 5000,
                minStaffPerPost: 1
            },
            security: {
                staffPerAttendees: 1/250,
                maxDensity: 4,
                checkpointsPerAttendees: 1/500
            },
            capacity: {
                maxVisitorsPerSqm: 0.25
            },
            facilities: {
                toiletsPerAttendees: 1/50,
                waterPointsPerAttendees: 1/100
            }
        });

        this.registerCountryPreset('BE', {
            // Belgische regels
        });

        this.registerCountryPreset('DE', {
            // Duitse regels
        });
    }

    registerCountryPreset(countryCode, rules) {
        this.countryPresets[countryCode] = this.deepClone(rules);
    }

    loadRules(countryCode, customRules = {}) {
        this.currentRules.countryCode = countryCode;
        this.currentRules.customRules = this.deepClone(customRules);
        this.currentRules.rules = this.deepMerge(
            this.deepClone(this.countryPresets[countryCode] || {}),
            this.currentRules.customRules
        );
    }

    getCurrentRules() {
        return this.deepClone(this.currentRules);
    }

    validate(elements, attendeeCount, walkableArea) {
        const report = {
            isValid: true,
            violations: [],
            warnings: [],
            statistics: {
                medical: {},
                security: {},
                facilities: {},
                density: {}
            },
            timestamp: new Date().toISOString()
        };

        if (!this.currentRules.rules) {
            report.violations.push({
                type: 'configuration',
                message: 'No safety rules configured',
                severity: 'high'
            });
            report.isValid = false;
            return report;
        }

        // Medical validation
        this.validateMedical(elements, attendeeCount, report);
        
        // Security validation
        this.validateSecurity(elements, attendeeCount, report);
        
        // Capacity validation
        this.validateCapacity(attendeeCount, walkableArea, report);
        
        // Facilities validation
        this.validateFacilities(elements, attendeeCount, report);

        return report;
    }

    validateMedical(elements, attendees, report) {
        const medicalRules = this.currentRules.rules.medical;
        if (!medicalRules) return;

        const medicalPoints = elements.filter(el => 
            ['first-aid-station', 'medical-tent'].includes(el.type)
        );

        // Minimum posts check
        if (medicalPoints.length < medicalRules.minFirstAidPosts) {
            report.violations.push({
                type: 'medical',
                code: 'MIN_POSTS',
                message: `Minimum ${medicalRules.minFirstAidPosts} first aid post(s) required`,
                required: medicalRules.minFirstAidPosts,
                actual: medicalPoints.length,
                severity: 'high'
            });
        }

        // Staff requirements
        const requiredStaff = Math.ceil(attendees * medicalRules.staffPerAttendees);
        const actualStaff = medicalPoints.reduce((sum, post) => {
            return sum + (post.properties?.staffRequired?.roles?.medical || 0);
        }, 0);

        if (actualStaff < requiredStaff) {
            report.violations.push({
                type: 'medical',
                code: 'STAFF_SHORTAGE',
                message: `Insufficient medical staff (required: ${requiredStaff}, actual: ${actualStaff})`,
                required: requiredStaff,
                actual: actualStaff,
                severity: 'high'
            });
        }

        // Coverage area
        if (medicalRules.coverageArea) {
            const totalArea = this.calculateTotalArea(elements);
            const requiredPosts = Math.ceil(totalArea / medicalRules.coverageArea);
            
            if (medicalPoints.length < requiredPosts) {
                report.warnings.push({
                    type: 'medical',
                    code: 'COVERAGE_AREA',
                    message: `Consider adding more first aid posts for better coverage`,
                    recommended: requiredPosts,
                    actual: medicalPoints.length,
                    severity: 'medium'
                });
            }
        }

        report.statistics.medical = {
            posts: medicalPoints.length,
            staff: actualStaff,
            requiredStaff,
            coverage: medicalPoints.length > 0 ? 'OK' : 'INSUFFICIENT'
        };
    }

    validateSecurity(elements, attendees, report) {
        const securityRules = this.currentRules.rules.security;
        if (!securityRules) return;

        const securityPoints = elements.filter(el => 
            ['security-checkpoint', 'security-camera', 'security-guard'].includes(el.type)
        );

        // Staff requirements
        const requiredStaff = Math.ceil(attendees * securityRules.staffPerAttendees);
        const actualStaff = securityPoints.reduce((sum, point) => {
            return sum + (point.properties?.staffRequired?.roles?.security || 0);
        }, 0);

        if (actualStaff < requiredStaff) {
            report.violations.push({
                type: 'security',
                code: 'STAFF_SHORTAGE',
                message: `Insufficient security staff (required: ${requiredStaff}, actual: ${actualStaff})`,
                required: requiredStaff,
                actual: actualStaff,
                severity: 'high'
            });
        }

        // Checkpoints
        if (securityRules.checkpointsPerAttendees) {
            const requiredCheckpoints = Math.ceil(attendees * securityRules.checkpointsPerAttendees);
            const actualCheckpoints = elements.filter(el => 
                el.type === 'security-checkpoint'
            ).length;

            if (actualCheckpoints < requiredCheckpoints) {
                report.warnings.push({
                    type: 'security',
                    code: 'CHECKPOINTS',
                    message: `Consider adding more security checkpoints`,
                    recommended: requiredCheckpoints,
                    actual: actualCheckpoints,
                    severity: 'medium'
                });
            }
        }

        report.statistics.security = {
            staff: actualStaff,
            requiredStaff,
            checkpoints: securityPoints.length
        };
    }

    validateCapacity(attendees, walkableArea, report) {
        const capacityRules = this.currentRules.rules.capacity;
        if (!capacityRules || !walkableArea) return;

        const maxByDensity = Math.floor(walkableArea * capacityRules.maxVisitorsPerSqm);
        
        if (attendees > maxByDensity) {
            report.violations.push({
                type: 'capacity',
                code: 'MAX_DENSITY',
                message: `Maximum density exceeded (max ${maxByDensity} visitors for this area)`,
                allowed: maxByDensity,
                actual: attendees,
                severity: 'critical'
            });
        }

        report.statistics.density = {
            attendees,
            maxAllowed: maxByDensity,
            areaPerPerson: walkableArea / attendees,
            status: attendees <= maxByDensity ? 'OK' : 'OVERLIMIT'
        };
    }

    validateFacilities(elements, attendees, report) {
        const facilitiesRules = this.currentRules.rules.facilities;
        if (!facilitiesRules) return;

        // Toilets
        if (facilitiesRules.toiletsPerAttendees) {
            const requiredToilets = Math.ceil(attendees * facilitiesRules.toiletsPerAttendees);
            const actualToilets = elements.filter(el => 
                ['toilet', 'portable-toilet', 'urinal-station'].includes(el.type)
            ).length;

            if (actualToilets < requiredToilets) {
                report.warnings.push({
                    type: 'facilities',
                    code: 'TOILETS',
                    message: `Consider adding more toilets (recommended: ${requiredToilets})`,
                    recommended: requiredToilets,
                    actual: actualToilets,
                    severity: 'medium'
                });
            }
        }

        // Water points
        if (facilitiesRules.waterPointsPerAttendees) {
            const requiredWaterPoints = Math.ceil(attendees * facilitiesRules.waterPointsPerAttendees);
            const actualWaterPoints = elements.filter(el => 
                ['water-station', 'water-refill-station'].includes(el.type)
            ).length;

            if (actualWaterPoints < requiredWaterPoints) {
                report.warnings.push({
                    type: 'facilities',
                    code: 'WATER_POINTS',
                    message: `Consider adding more water points`,
                    recommended: requiredWaterPoints,
                    actual: actualWaterPoints,
                    severity: 'low'
                });
            }
        }

        report.statistics.facilities = {
            toilets: elements.filter(el => ['toilet', 'portable-toilet'].includes(el.type)).length,
            waterPoints: elements.filter(el => 
                ['water-station', 'water-refill-station'].includes(el.type)
            ).length
        };
    }

    calculateTotalArea(elements) {
        // Calculate the total walkable area based on terrain and obstacles
        const terrain = elements.find(el => el.type === 'terrain');
        if (!terrain) return 0;

        const totalArea = terrain.width * terrain.height;

        const obstacles = elements.filter(el => el.type === 'obstacle');
        const obstacleArea = obstacles.reduce((sum, obstacle) => {
            return sum + (obstacle.width * obstacle.height);
        }, 0);

        return totalArea - obstacleArea;
    }

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    deepMerge(target, source) {
        for (const key in source) {
            if (source[key] instanceof Object && !Array.isArray(source[key])) {
                target[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
}