/**
 * JSON-LD 스키마 생성 헬퍼 함수 모음
 */

const createOrganizationSchema = require('./schemas/organization');
const createWebSiteSchema = require('./schemas/website');
const createBreadcrumbSchema = require('./schemas/breadcrumb');
const createImageGallerySchema = require('./schemas/imageGallery');

module.exports = {
  createOrganizationSchema,
  createWebSiteSchema,
  createBreadcrumbSchema,
  createImageGallerySchema
};
