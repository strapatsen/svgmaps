import Vendor from '../../scripts/vendor.loader.js';

export default class VendorLoader {
    static async load() {
        await Promise.all([
            Vendor.axios(),
            Vendor.THREE(),
            Vendor.tensorflow(),
            Vendor.turf(),
            Vendor.arjs(),
            Vendor.graphql(),
            Vendor.mapbox(),
            Vendor.react3d(),
            Vendor.socketio(),
            Vendor.webworker()
        ]);
    }
}