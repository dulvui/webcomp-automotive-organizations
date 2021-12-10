import config from "./config";
import axios from "axios";

export function getCompanies(language, path, parameters) {
  return axios.get(config.API_BASE_URL + path, {
    parameters: parameters
  })
    .then(function (response) {
      console.log("data fetched")
      return generateCompanies(response.data, language);
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
}

function generateCompanies(res, language) {
  var companies = [];

  res.data.forEach((el, i) => {
    if (el.smetadata.online == true) {
      var company = parseCompanyData(i, el);

      switch (language) {
        case "en":
          company.sector = company.sectorEn;
          company.description = company.descriptionEn;
          break;
        case "de":
          company.sector = company.sectorDe;
          company.description = company.descriptionDe;
          break;
        case "it":
          company.sector = company.sectorIt;
          company.description = company.descriptionIt;
          break;
      }

      companies.push(company);
    }
  });

  return companies;
}

function parseCompanyData(index, element) {
  var meta = element.smetadata

  var industryId
  var activityTypeId

  switch (meta.industry.trim().toLowerCase()) {
    case "architecture":
      industryId = 0;
      break;
    case "software & games":
      industryId = 1;
      break;
    case "design":
      industryId = 2;
      break;
    case "publishing & press":
      industryId = 3;
      break;
    case "visual arts":
      industryId = 4;
      break;
    case "film & video":
      industryId = 5;
      break;
    case "radio & tv":
      industryId = 6;
      break;
    case "music":
      industryId = 7;
      break;
    case "performing arts":
      industryId = 8;
      break;
    case "handicraft":
      industryId = 9;
      break;
    case "advertising":
      industryId = 10;
      break;
    default:
      industryId = 10;
      console.log("ERROR IN INDUSTRY NAME:" + meta.industry);
  }

  switch (meta.legal_form.trim().toLowerCase()) {
    case "freelance":
      activityTypeId = 0;
      break;
    case "company":
      activityTypeId = 1;
      break;
    case "association":
      activityTypeId = 2;
      break;
    case "entity":
      activityTypeId = 3;
      break;
  }

  var fb, ig, linkedin;
  var website, websiteURL;
  if (meta.fb) {
    fb = parseURL(meta.fb);
  }
  if (meta.ig) {
    ig = parseURL(meta.ig);
  }
  if (meta.linkedin) {
    linkedin = parseURL(meta.linkedin);
  }
  if (meta.website) {
    var url = parseURL(meta.website);
    website = url[0];
    websiteURL = url[1];
  }

  return {
    id: index,
    name: meta.name,
    industrie: industryId,
    sectorEn: meta.sector.en,
    sectorDe: meta.sector.de,
    sectorIt: meta.sector.it,
    activity: activityTypeId,
    coords: [element.scoordinate.y, element.scoordinate.x],
    logo: meta.logo,
    descriptionEn: meta.description.en,
    descriptionDe: meta.description.de,
    descriptionIt: meta.description.it,
    facebook: fb,
    instagram: ig,
    linkedin: linkedin,
    website: website,
    websiteURL: websiteURL,
    phone: meta.phone_number,
    mail: meta.email,
    active: true
  }
}

function parseURL(url) {
  var protocolRegex = /^(http[s]?:\/\/)/gm;

  if (!protocolRegex.test(url)) {
    return [url, "//" + url];
  } else {
    return [url.replace(protocolRegex, ""), url]; 
  }
}