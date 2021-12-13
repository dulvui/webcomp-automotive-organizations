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
    // if (el.smetadata.online == true) {
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
    // }
  });

  return companies;
}

function parseCompanyData(index, element) {
  var meta = element.smetadata

  let imageLogoLink = config.IMAGES_S3_BUCKET_URL;
  let imageFigure1Link = config.IMAGES_S3_BUCKET_URL;
  let imageFigure2Link = config.IMAGES_S3_BUCKET_URL;



  var linkedin;
  var website, websiteURL;

  if (meta.linkedin) {
    linkedin = parseURL(meta.linkedin);
  }
  if (meta.website) {
    var url = parseURL(meta.website);
    website = url[0];
    websiteURL = url[1];
  }

  // hack to change images suffix to .png
  imageLogoLink += meta.image_logo.substring(0, meta.image_logo.length - 4) + ".png";
  imageFigure1Link += meta.image_figure_1.substring(0, meta.image_figure_1.length - 4) + ".png";
  imageFigure2Link += meta.image_figure_2.substring(0, meta.image_figure_2.length - 4) + ".png";


  console.log(meta.products__services.en);

  return {
    id: meta.organization__short_name.de,
    name: meta.organization__short_name.de,
    industrie: "",
    sectorEn: "",
    sectorDe: "",
    sectorIt: "",
    activity: "",
    coords: [element.scoordinate.y, element.scoordinate.x],
    logo: imageLogoLink,
    figure1: imageFigure1Link,
    figure2: imageFigure2Link,
    figure1DescriptionEn: meta.figure1_description ? meta.figure1_description.en : "",
    figure1DescriptionDe: meta.figure1_description ? meta.figure1_description.de : "",
    figure1DescriptionIt: meta.figure1_description ? meta.figure1_description.it : "",
    figure2DescriptionEn: meta.figure2_description ? meta.figure2_description.en : "",
    figure2DescriptionDe: meta.figure2_description ? meta.figure2_description.de : "",
    figure2DescriptionIt: meta.figure2_description ? meta.figure2_description.it : "",
    descriptionEn: meta.organization_description.en,
    descriptionDe: meta.organization_description.de,
    descriptionIt: meta.organization_description.it,
    productServicesEn: meta.products__services.en,
    productServicesDe: meta.products__services.de,
    productServicesIt: meta.products__services.it,
    industrialSector: meta.industrial_sector,
    contactPerson: {
      name: meta.contact_person,
      roleEn: meta.contact_person_role ? meta.contact_person_role.en : "",
      roleDe: meta.contact_person_role ? meta.contact_person_role.de : "",
      roleIt: meta.contact_person_role ? meta.contact_person_role.it : "",
      email: meta.email_contact_person
    },
    certifications: meta.certifications,
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