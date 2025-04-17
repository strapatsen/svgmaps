// Vendor.imports.js

// Core & Utils
import axios from 'axios'
import { io } from 'socket.io-client'
import * as turf from '@turf/turf'
import * as tf from '@tensorflow/tfjs'

// 3D & Viewer
import * as THREE from 'three'
import 'ar.js'
import Viewer from 'react-3d-viewer'

// Mapping
import mapboxgl from 'mapbox-gl'

// Worker support
import WebWorker from 'web-worker'

// GraphQL
import { graphql } from 'graphql'

export {
  axios,
  io,
  turf,
  tf,
  THREE,
  Viewer,
  mapboxgl,
  WebWorker,
  graphql
}
