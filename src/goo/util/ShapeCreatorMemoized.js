define([
	'goo/shapes/Box',
	'goo/shapes/Quad',
	'goo/shapes/Sphere',
	'goo/shapes/Cylinder',
	'goo/shapes/Torus',
	'goo/shapes/Disk'
],
/** @lends */

function (
	Box,
	Quad,
	Sphere,
	Cylinder,
	Torus,
	Disk
) {
	"use strict";

	/**
	 * @class Factory for shape creation.
	 * @description Only used to define the class. Should never be instantiated.
	 */

	function ShapeCreatorMemoized() {
	}

	var _cache = {};
	//var hits = 0, requests = 0;

	function computeHash(name, options) {
		var keys = Object.keys(options);
		var optionsStr = keys.map(function(key) {
			return key + '' + options[key];
		}).join('');
		return name + optionsStr;
	}

	function cacheOrCreate(name, options, createShape) {
		var hash = computeHash(name, options);
		//requests++;
		if (_cache[hash]) {
			//hits++;
			//console.log('HIT, ratio: ', hits/requests);
			return _cache[hash];
		} else {
			//console.log('MISS, ratio: ', hits/requests);
			var shape = createShape();
			_cache[hash] = shape;
			return shape;
		}
	}

	ShapeCreatorMemoized.createQuad = function (options, oldMeshData) {
		var width = 1, height = 1, tileX = 1, tileY = 1;
		if (!oldMeshData ||
			width !== oldMeshData.xExtent ||
			height !== oldMeshData.yExtent ||
			tileX !== oldMeshData.tileX ||
			tileY !== oldMeshData.tileY) {
			return cacheOrCreate('quad', {}, function() {
				return new Quad(width, height, tileX, tileY);
			});
		} else {
			return oldMeshData;
		}
	};

	ShapeCreatorMemoized.createBox = function (options, oldMeshData) {
		var width = 1, height = 1, length = 1, tileX = 1, tileY = 1;
		if (!oldMeshData ||
			width !== oldMeshData.xExtent ||
			height !== oldMeshData.yExtent ||
			length !== oldMeshData.zExtent ||
			tileX !== oldMeshData.tileX ||
			tileY !== oldMeshData.tileY) {
			return cacheOrCreate('box', {}, function() {
				return new Box(width, height, length, tileX, tileY);
			});
		} else {
			return oldMeshData;
		}
	};

	ShapeCreatorMemoized.createSphere = function (options, oldMeshData) {
		options = options || {};
		options.zSamples = options.zSamples || 8;
		options.radialSamples = options.radialSamples || 8;
		options.textureMode = options.textureMode || 'Projected';
		var radius = 1;

		if (!oldMeshData ||
			options.zSamples !== oldMeshData.zSamples-1 ||
			options.radialSamples !== oldMeshData.radialSamples ||
			options.textureMode !== oldMeshData.textureMode.name ||
			radius !== oldMeshData.radius) {
			return cacheOrCreate('sphere', options, function() {
				return new Sphere(options.zSamples, options.radialSamples, radius, options.textureMode);
			});
		} else {
			return oldMeshData;
		}
	};

	ShapeCreatorMemoized.createCylinder = function (options, oldMeshData) {
		options = options || {};
		options.radialSamples = options.radialSamples || 8;
		var radius = 1;

		if (!oldMeshData ||
			options.radialSamples !== oldMeshData.radialSamples ||
			radius !== oldMeshData.radius) {
			return cacheOrCreate('cylinder', options, function() {
				return new Cylinder(options.radialSamples, radius);
			});
		} else {
			return oldMeshData;
		}
	};

	ShapeCreatorMemoized.createTorus = function (options, oldMeshData) {
		options = options || {};
		options.radialSamples = options.radialSamples || 8;
		options.circleSamples = options.circleSamples || 12;
		options.tubeRadius = options.tubeRadius || 0.2;
		var centerRadius = 1;

		if (!oldMeshData ||
			options.radialSamples !== oldMeshData._radialSamples ||
			options.circleSamples !== oldMeshData._circleSamples ||
			options.tubeRadius !== oldMeshData._tubeRadius ||
			centerRadius !== oldMeshData._centerRadius) {
			//return cacheOrCreate('torus', options, function() { // cannot cache torus because of real typed tubeRadius
				return new Torus(options.circleSamples, options.radialSamples, options.tubeRadius, centerRadius);
			//});
		} else {
			return oldMeshData;
		}
	};

	ShapeCreatorMemoized.createDisk = function (options, oldMeshData) {
		options = options || {};
		options.radialSamples = options.radialSamples || 8;
		options.pointiness = typeof options.pointiness === 'undefined' ? 0 : options.pointiness;
		var radius = 1;

		if (!oldMeshData ||
			options.radialSamples !== oldMeshData.nSegments ||
			options.pointiness !== oldMeshData.pointiness ||
			radius !== oldMeshData.radius) {
			if (options.pointiness === Math.floor(options.pointiness)) {
				return cacheOrCreate('disk', options, function() {
					return new Disk(options.radialSamples, radius, options.pointiness);
				});
			} else {
				return new Disk(options.radialSamples, radius, options.pointiness);
			}
		} else {
			return oldMeshData;
		}
	};

	return ShapeCreatorMemoized;
});