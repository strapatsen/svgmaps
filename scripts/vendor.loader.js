const Vendor = {
  async axios() {
      if (!window.axios) window.axios = (await import('axios')).default;
  },

  async THREE() {
      if (!window.THREE) window.THREE = await import('three');
  },

  async tensorflow() {
      if (!window.tf) window.tf = await import('@tensorflow/tfjs');
  },

  async turf() {
      if (!window.turf) window.turf = await import('@turf/turf');
  },

  async arjs() {
      if (!window.AR) window.AR = await import('ar.js');
  },

  async graphql() {
      if (!window.graphql) window.graphql = await import('graphql');
  },

  async mapbox() {
      if (!window.mapboxgl) window.mapboxgl = await import('mapbox-gl');
  },

  async react3d() {
      if (!window.React3DViewer) window.React3DViewer = await import('react-3d-viewer');
  },

  async socketio() {
      if (!window.io) window.io = await import('socket.io');
  },

  async webworker() {
      if (!window.WebWorkerLib) window.WebWorkerLib = await import('web-worker');
  }
};

export default Vendor;
