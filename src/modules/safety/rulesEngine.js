class RuleEngine {

    constructor(terrain, countryCode = 'NL', localRules = {}) {
      this.terrain = terrain;
      this.rules = this.loadRules(countryCode, localRules);
      this.violations = [];
    }
  
    loadRules(countryCode, localRules) {
      // Basisregels per land (kan uitgebreid worden)
      const countryRules = {
        NL: {
          medical: {
            minFirstAidPosts: 1,
            staffPerAttendees: 1/750,
            coverageArea: 5000 // in m²
          },
          security: {
            staffPerAttendees: 1/250,
            maxDensity: 4 // personen per m²
          },
          capacity: {
            maxVisitors: null // wordt bepaald door terrein
          }
        }
      };
  
      return { ...countryRules[countryCode], ...localRules };
    }
  
    validateAll() {
      this.violations = [];
      this.validateMedical();
      this.validateSecurity();
      this.validateCapacity();
      return this.violations;
    }
  
    validateMedical() {
      // EHBO validatie
      const medicalPoints = this.terrain.getElementsByType(['first-aid-station', 'medical-tent']);
      const requiredStaff = Math.ceil(this.terrain.attendees * this.rules.medical.staffPerAttendees);
      
      if (medicalPoints.length < this.rules.medical.minFirstAidPosts) {
        this.violations.push({
          type: 'medical',
          message: `Onvoldoende EHBO posten (minimaal ${this.rules.medical.minFirstAidPosts} vereist)`,
          severity: 'high'
        });
      }
      
      // Staff validatie per post
      medicalPoints.forEach(post => {
        if (post.properties.staffRequired.roles.medical < 1) {
          this.violations.push({
            type: 'medical',
            elementId: post.id,
            message: 'EHBO post heeft minimaal 1 medische medewerker nodig',
            severity: 'high'
          });
        }
      });
    }
  
    validateSecurity() {
      // Security validatie
      const securityPoints = this.terrain.getElementsByType(['security-checkpoint']);
      const requiredSecurity = Math.ceil(this.terrain.attendees * this.rules.security.staffPerAttendees);
      const actualSecurity = securityPoints.reduce((sum, point) => 
        sum + point.properties.staffRequired.roles.security, 0);
      
      if (actualSecurity < requiredSecurity) {
        this.violations.push({
          type: 'security',
          message: `Onvoldoende security personeel (${requiredSecurity} nodig, ${actualSecurity} aanwezig)`,
          severity: 'medium'
        });
      }
    }
  
    validateCapacity() {
      // Capaciteitsberekening
      const availableArea = this.terrain.getWalkableArea(); // in m²
      const maxByDensity = Math.floor(availableArea / this.rules.security.maxDensity);
      const maxVisitors = this.rules.capacity.maxVisitors 
                        || Math.min(maxByDensity, this.terrain.maxCapacity);
      
      if (this.terrain.attendees > maxVisitors) {
        this.violations.push({
          type: 'capacity',
          message: `Maximaal aantal bezoekers overschreden (${maxVisitors} toegestaan)`,
          severity: 'critical'
        });
      }
    }
    
}