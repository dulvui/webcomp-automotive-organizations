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
    var company = parseCompanyData(i, el);

    company.description = company.description[language];
    company.productServices = company.productServices[language];
    company.references = company.references[language];
    company.address = company.address[language];

    company.figure1.description = company.figure1.description[language];
    company.figure2.description = company.figure2.description[language];

    company.contactPerson.role = company.contactPerson.role[language];

    switch (language) {
      case "en":
        company.sector = company.sectorEn;
        break;
      case "de":
        company.sector = company.sectorDe;
        break;
      case "it":
        company.sector = company.sectorIt;
        break;
    }

    companies.push(company);
  });

  return companies;
}

function parseCompanyData(index, element) {
  var meta = element.smetadata;

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


  return {
    id: meta.organization__short_name.de,
    name: meta.organization__short_name.de,
    legalName: meta.organizationlegal_name,
    address: {
      de: meta.address.de,
      it: meta.address.it,
      en: meta.address.it,
    },
    industrie: "",
    sectorEn: "",
    sectorDe: "",
    sectorIt: "",
    activity: "",
    coords: [element.scoordinate.y, element.scoordinate.x],
    logo: imageLogoLink,
    figure1: {
      link : imageFigure1Link,
      description: {
        en: meta.figure1_description ? meta.figure1_description.en : "",
        de: meta.figure1_description ? meta.figure1_description.de : "",
        it: meta.figure1_description ? meta.figure1_description.it : "",
      },
    },
    figure2: {
      link: imageFigure2Link,
      description: {
        en: meta.figure2_description ? meta.figure2_description.en : "",
        de: meta.figure2_description ? meta.figure2_description.de : "",
        it: meta.figure2_description ? meta.figure2_description.it : "",
      },
    },
    description : {
      en: meta.organization_description.en,
      de: meta.organization_description.de,
      it: meta.organization_description.it,
    },
    productServices : {
      en: meta.products__services.en,
      de: meta.products__services.de,
      it: meta.products__services.it,
    },
    references : {
      en: meta.references ? meta.references.en : "",
      de: meta.references ? meta.references.de : "",
      it: meta.references ? meta.references.it : "",
    },
    industrialSector: meta.industrial_sector,
    contactPerson: {
      name: meta.contact_person,
      role : {
        en: meta.contact_person_role ? meta.contact_person_role.en : "",
        de: meta.contact_person_role ? meta.contact_person_role.de : "",
        it: meta.contact_person_role ? meta.contact_person_role.it : "",
      },
      email: meta.email_contact_person
    },
    certifications: meta.certifications,
    linkedin: linkedin,
    website: website,
    websiteURL: websiteURL,
    phone: meta.phone,
    mail: meta.email,
    turnover: meta.turnover_m,
    exportQuote: meta.export_quote_,
    rdQuote : meta.rd_quotefacts,
    employees: meta.employees,
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