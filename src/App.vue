<template>
  <div
    id="app"
    ref="app"
    class="container"
    :style="{ width: width, height: height }"
    v-bind:class="appWidth"
    v-on:resize="setResponsive()"
  >
    <div id="map" ref="map" class="map"></div>
    <div
      class="center-button inline-block button white-bg rounded"
      @click="centerMap()"
    >
      <div class="center-area">
        <div class="center-icon icon center-x center-y"></div>
      </div>
    </div>
    <div class="logo bottom-left"></div>
    <div
      id="omnibox"
      class="margined shadowed rounded"
      v-bind:class="{ expanded: menuActive }"
    >
      <div class="navbar" v-bind:class="{ active: !filterIsActive }">
        <div class="row">
          <div
            class="title-header center-area fill"
            v-bind:class="{
              active: currentSinglebox !== 'industries' || search,
            }"
          >
            <div
              class="nav-back inline-block center-y icon back-icon clickable"
              @click="stepBack()"
            ></div>
            <div class="title inline-block center-y title">
              {{ currentSingleboxTitle }}
            </div>
          </div>
          <div class="center-area">
            <input
              ref="search-bar"
              class="search-bar inline-block center-y rounded"
              v-bind:class="{ active: searchIsActive }"
              type="text"
              :placeholder="$t('search-placeholder')"
              v-model="searchValue"
            />
            <div
              class="search-button inline-block button rounded center-y"
              v-bind:class="{ active: searchIsActive }"
              @click="toggleSearchbar()"
            >
              <div class="center-area">
                <div class="search-icon icon center-x center-y"></div>
              </div>
            </div>
            <!-- <div class="inline-block button rounded center-y" @click="showFilters()">
              <div class="center-area">
                <div class="filter-icon icon center-x center-y"></div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
      <div class="nav-filters navbar" v-bind:class="{ active: filterIsActive }">
        <div class="row">
          <div class="center-area fill">
            <div class="inline-block center-y title">{{ $t("filter") }}</div>
          </div>
          <div class="center-area">
            <div
              class="inline-block button primary-bg rounded center-y"
              @click="showFilters()"
            >
              <div class="center-area">
                <div class="confirm-icon icon center-x center-y"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="industries"
        class="singlebox"
        v-bind:class="{
          active: currentSinglebox === 'industries',
          shift: lastBoxes.includes('industries'),
        }"
      >
        <div class="select-list">
          <div
            class="select-item center-area"
            v-for="company in companies"
            :key="company.id"
            @click="industrieSelected(company.id)"
          >
            <div
              class="company-logo icon center-y"
              v-bind:style="{ 'background-image': 'url(' + company.logo + ')' }"
            ></div>
            <div class="select-item-label center-y">{{ company.name }}</div>
            <div class="center-y icon forward-icon"></div>
          </div>
        </div>
      </div>
      <div
        id="sectors"
        class="singlebox"
        v-bind:class="{
          active: currentSinglebox === 'sectors',
          shift: lastBoxes.includes('sectors'),
        }"
      >
        <div class="select-list">
          <div
            class="select-item center-area"
            v-for="sector in filters.sectors"
            :key="sector"
            @click="sectorSelected(sector)"
          >
            <div class="select-item-label center-y">{{ sector }}</div>
            <div class="center-y icon forward-icon"></div>
          </div>
        </div>
      </div>
      <div
        id="results"
        class="singlebox"
        v-bind:class="{
          active: currentSinglebox === 'results',
          shift: lastBoxes.includes('results'),
        }"
      >
        <div class="select-list">
          <div class="select-item center-area" v-if="results.length === 0">
            <div class="select-item-label center-y">{{ $t("no-result") }}</div>
          </div>
          <div
            class="select-item center-area"
            v-for="company in results"
            :key="company"
            @click="companySelected(company.id)"
          >
            <div
              class="center-y icon rounded placeholder"
              v-bind:style="{ 'background-image': 'url(' + company.logo + ')' }"
            ></div>
            <div class="select-item-label center-y">{{ company.name }}</div>
            <div class="center-y icon forward-icon"></div>
          </div>
        </div>
      </div>
      <div
        id="selection"
        class="singlebox"
        v-bind:class="{ active: currentSinglebox === 'selection' }"
      >
        <div class="row">
          <div class="links">
            <div class="social">
              <a
                class="icon"
                v-if="selection.linkedin"
                :href="'//' + selection.linkedin"
                target="_blank"
              >
                <div class="icon rounded linkedin-icon"></div>
              </a>
            </div>
            <div class="website">
              <a :href="selection.websiteURL" target="_blank">{{
                selection.website
              }}</a>
            </div>
          </div>
          <div
            class="figure1"
            v-bind:style="{
              'background-image': 'url(' + selection.figure1 + ')',
            }"
          ></div>
          <div
            class="figure2"
            v-bind:style="{
              'background-image': 'url(' + selection.figure2 + ')',
            }"
          ></div>
          <div
            class="logo"
            v-bind:style="{ 'background-image': 'url(' + selection.logo + ')' }"
          ></div>
        </div>
        <div class="selection-title">{{ selection.name }}</div>
        <div class="selection-subtitle">UNTERNEHMEN</div>
        <div class="description">{{ selection.description }}</div>
         <div class="selection-subtitle">PRODUKTE UND DIENSTL</div>
        <div class="description">{{ selection.productServicesEn }}</div>
        <div v-if="selection.address" class="contact center-area">
          <div class="center-y button rounded primary-bg">
            <div class="center-area">
              <div class="pin-icon icon center-x center-y"></div>
            </div>
          </div>
          <div class="address center-y">{{ selection.address }}</div>
        </div>
        <div v-if="selection.phone" class="contact center-area">
          <div class="center-y button rounded primary-bg">
            <div class="center-area">
              <div class="phone-icon icon center-x center-y"></div>
            </div>
          </div>
          <div class="phone-number center-y">{{ selection.phone }}</div>
        </div>
        <div
          v-if="selection.mail"
          class="contact center-area"
          style="padding-bottom: 25px"
        >
          <div class="center-y button rounded primary-bg">
            <div class="center-area">
              <div class="mail-icon icon center-x center-y"></div>
            </div>
          </div>
          <div class="mail center-y">
            <a
              :href="'mailto:' + selection.mail"
              style="color: black; text-decoration: none"
              >{{ selection.mail }}</a
            >
          </div>
        </div>
      </div>
      <div
        id="filters"
        class="singlebox"
        v-bind:class="{ active: filterIsActive }"
      >
        <div class="filter-class">
          <div class="title">{{ $t("type") }}:</div>
          <div
            class="form-check"
            v-for="activity in activities"
            :key="activity.id"
          >
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="activity.active"
                @change="activityChanged(activity.id, activity.active)"
              />
              <span></span>
              {{ activity.name }}
            </label>
          </div>
        </div>

        <div class="filter-class" v-if="search">
          <div class="title">{{ $t("industry") }}:</div>
          <div
            class="form-check"
            v-for="industrie in industries"
            :key="industrie.id"
          >
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="industrie.active"
                @change="industrieChanged(industrie.id, industrie.active)"
              />
              <span></span>
              {{ industrie.name }}
            </label>
          </div>
        </div>
      </div>
      <div class="expand-menu clickable center-area" @click="toggleMenu()">
        <div class="icon down-icon center-x center-y"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import * as L from "leaflet";
import "leaflet.markercluster";

import { getCompanies } from "./api/fetcher";

export default {
  name: "webcomp-creative-industries",
  i18n: new VueI18n({
    locale: "en",
    messages: {
      en: {
        industry: "Industry",
        industries: "Industries",
        type: "Type",
        filter: "Filter",
        "search-placeholder": "Freelancers, Companies, ...",
        "no-result": "No results.",
        design: "Design",
        "film-and-video": "Film & Video",
        architecture: "Architecture",
        music: "Music",
        "radio-and-tv": "Radio & TV",
        advertising: "Advertising",
        handicraft: "Handicraft",
        press: "Publishing & Press",
        "performing-arts": "Performing Arts",
        "visual-arts": "Visual Arts",
        "software-and-games": "Software & Games",
        freelancer: "Freelancer",
        company: "Company",
        association: "Association",
        entity: "Public entity",
      },
      de: {
        industry: "Industrie",
        industries: "Industrien",
        type: "Typ",
        filter: "Filter",
        "search-placeholder": "Freelancers, Firmen, ...",
        "no-result": "Keine Ergebnisse.",
        design: "Design",
        "film-and-video": "Film & Video",
        architecture: "Architektur",
        music: "Musik",
        "radio-and-tv": "Radio & TV",
        advertising: "Werbung",
        handicraft: "Kunsthandwerk",
        press: "Buch, Verlangswesen & Presse",
        "performing-arts": "Darstellende Kunst",
        "visual-arts": "Bildende Kunst",
        "software-and-games": "Software & Games",
        freelancer: "Freelancer",
        company: "Firma",
        association: "Verband",
        entity: "Öffentliche Einrichtung",
      },
      it: {
        industry: "Industria",
        industries: "Industrie",
        type: "Tipo",
        filter: "Filtra",
        "search-placeholder": "Freelancer, Aziende, ...",
        "no-result": "Nessun risultato.",
        design: "Design",
        "film-and-video": "Film & Video",
        architecture: "Architettura",
        music: "Musica",
        "radio-and-tv": "Radio & TV",
        advertising: "Pubblicità",
        handicraft: "Artigianato artistico",
        press: "Editoria & Stampa",
        "performing-arts": "Arti performative",
        "visual-arts": "Arti visive",
        "software-and-games": "Software & Games",
        freelancer: "Freelancer",
        company: "Azienda",
        association: "Associazione",
        entity: "Ente pubblico",
      },
    },
  }),
  data() {
    return {
      publicPath: "/public/",

      appWidth: "",
      menuActive: false,
      map: null,
      center: [46.643211, 11.365379],
      zoom: 9,
      searchValue: "",
      markers: [],
      tileLayer: null,
      filters: {
        industries: [],
        sectors: [],
        activities: [],
      },
      results: [],
      selection: "",

      search: false,
      lastBoxes: [],
      lastBoxesTitle: [],
      currentSinglebox: "industries",
      currentSingleboxTitle: "",
      titleHeaderIsActive: false,
      searchIsActive: false,
      filterIsActive: false,

      activities: [],
      industries: [],
      companies: [],
    };
  },
  props: {
    locale: { type: String, default: () => "en" },
    width: { type: String, default: () => "100%" },
    height: { type: String, default: () => "100%" },
  },
  beforeMount() {
    this.$i18n.locale = this.locale;

    this.currentSingleboxTitle = this.$t("industries");
    this.activities = [
      {
        id: 0,
        name: this.$t("freelancer"),
        active: false,
      },
      {
        id: 1,
        name: this.$t("company"),
        active: false,
      },
      {
        id: 2,
        name: this.$t("association"),
        active: false,
      },
      {
        id: 3,
        name: this.$t("entity"),
        active: false,
      },
    ];
    this.industries = [
      {
        id: 0,
        name: this.$t("architecture"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/00.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/00.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 1,
        name: this.$t("software-and-games"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/01.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/01.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 2,
        name: this.$t("design"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/02.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/02.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 3,
        name: this.$t("press"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/03.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/03.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 4,
        name: this.$t("visual-arts"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/04.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/04.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 5,
        name: this.$t("film-and-video"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/05.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/05.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 6,
        name: this.$t("radio-and-tv"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/06.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/06.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 7,
        name: this.$t("music"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/07.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/07.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 8,
        name: this.$t("performing-arts"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/08.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/08.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 9,
        name: this.$t("handicraft"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/09.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/09.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
      {
        id: 10,
        name: this.$t("advertising"),
        sectors: [],
        active: false,
        icon: require("@/assets/icons/industries/11.png"),
        marker: L.icon({
          iconUrl: require("@/assets/markers/11.png"),
          iconSize: [18.5, 30], // size of the icon
          iconAnchor: [24, 32], // company of the icon which will correspond to marker's location
        }),
      },
    ];
  },
  async mounted() {
    this.companies = await getCompanies(this.locale, "/");

    this.initMap();
    this.initMarkers();
    this.initFilters();
    this.renderFilters();
    this.setResponsive();
    var self = this;
    window.addEventListener("resize", function () {
      self.setResponsive();
    });
  },
  methods: {
    setResponsive() {
      var app = this.$refs["app"];
      var w = app.clientWidth;

      if (w <= 500) {
        this.appWidth = "small";
      } else if (w <= 1199) {
        this.appWidth = "medium";
      } else {
        this.appWidth = "large";
      }
    },
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
    searching() {
      var b = this.searchValue.toLowerCase();
      this.results = this.companies.filter(function (company) {
        var a = company.name.toLowerCase();
        return a.includes(b);
      });

      this.companies.forEach((company) => {
        if (this.results.includes(company)) {
          company.active = true;
        } else {
          company.active = false;
        }
      });

      this.renderFilters();
    },

    toggleSearchbar() {
      this.menuActive = true;
      this.titleHeaderIsActive = true;

      this.searchIsActive = true;
      this.$refs["search-bar"].focus();

      this.initFilters();
      this.showActivePoints();
      this.search = true;

      this.lastBoxes = ["industries"];
      this.lastBoxesTitle = [this.$t("industries")];
      this.currentSinglebox = "results";
      this.currentSingleboxTitle = "";
    },

    resetSearchbar() {
      if (this.search) {
        this.searchIsActive = false;
        this.searchValue = "";
        this.search = false;
        this.backToStart();
      }
    },

    showFilters() {
      if (!this.filterIsActive) {
        this.menuActive = true;
      }
      this.filterIsActive = !this.filterIsActive;
    },

    centerMap() {
      // this.map.flyTo(this.center, this.zoom);
      this.myMapFlyTo(this.center, this.zoom);
    },

    backToStart() {
      if (this.currentSinglebox !== "industries") {
        this.stepBack();
        this.backToStart();
      } else {
        return;
      }
    },

    stepBack() {
      if (this.search) {
        if (this.currentSinglebox === "selection") {
          this.searchIsActive = true;
        } else {
          this.search = false;
          this.searchIsActive = false;
        }
      }

      switch (this.currentSinglebox) {
        case "sectors":
          this.filters.industries = [];
          this.industries.forEach((industrie) => {
            this.filters.industries.push(industrie.id);
          });
        /* falls through */
        case "results":
          this.filters.sectors = [];
          this.filters.industries.forEach((industrieId) => {
            var industrie = this.industries.find(
              (industrie) => industrie.id === industrieId
            );
            industrie.sectors.forEach((sector) => {
              this.filters.sectors.push(sector);
            });
          });
          break;
        case "selection":
          this.centerMap();
          break;
      }

      this.currentSingleboxTitle = this.lastBoxesTitle.pop();
      this.currentSinglebox = this.lastBoxes.pop();

      this.activateAllPoints();
      this.renderFilters();
    },

    companySelected(id) {
      this.searchIsActive = false;

      const company = this.companies.find((company) => company.id === id);
      this.activateSinglebox("selection");
      this.selection = company;

      // this.map.flyTo(company.coords, 16);
      this.myMapFlyTo(company.coords, 16);
    },

    sectorSelected(sectorId) {
      this.activateSinglebox("results", sectorId);

      this.filters.sectors = [sectorId];
      this.renderFilters();
      this.results = this.companies.filter(function (i) {
        return i.active === true;
      });
    },

    industrieSelected(id) {
      // const industrie = this.industries.find(
      //   industrie => industrie.id === industrieId
      // );

      // this.activateSinglebox("sectors", industrie.name);
      // this.industries.forEach(i => {
      //   if (i.id !== industrieId) {
      //     i.active = false;
      //   } else {
      //     i.active = true;
      //   }
      //   this.industrieChanged(i.id, i.active);
      // });

      // this.filters.industries = [industrieId];
      // this.filters.sectors = industrie.sectors;

      // this.searching();

      this.searchIsActive = false;

      const company = this.companies.find((company) => company.id === id);
      this.activateSinglebox("selection");
      this.selection = company;

      // this.map.flyTo(company.coords, 16);
      this.myMapFlyTo(company.coords, 16);
    },

    industrieChanged(industrieId, active) {
      if (active) {
        if (!this.filters.industries.includes(industrieId)) {
          this.filters.industries.push(industrieId);
        }
      } else {
        this.filters.industries = this.filters.industries.filter(function (i) {
          return i !== industrieId;
        });
      }

      this.searching();
    },

    activityChanged(activityId, active) {
      if (active) {
        if (!this.filters.activities.includes(activityId)) {
          this.filters.activities.push(activityId);
        }
      } else {
        this.filters.activities = this.filters.activities.filter(function (i) {
          return i !== activityId;
        });
      }

      this.companies.forEach((company) => {
        company.active = true;
      });

      this.searching();
    },

    activateSinglebox(id) {
      this.lastBoxes.push(this.currentSinglebox);
      this.lastBoxesTitle.push(this.currentSingleboxTitle);
      this.currentSinglebox = id;
      this.currentSingleboxTitle = "";
    },

    activateAllPoints() {
      this.companies.forEach((company) => {
        company.active = true;
      });
    },

    showActivePoints() {
      var newMarkers = new L.MarkerClusterGroup();
      // var newMarkers = new L.LayerGroup();

      this.companies.forEach((company) => {
        if (company.active) {
          company.leafletObject.addTo(newMarkers);
        }
      });

      this.markers.removeFrom(this.map);
      this.markers = newMarkers;
      this.markers.addTo(this.map);
    },

    renderFilters() {
      this.companies.forEach((company) => {
        var a = this.filters.industries.includes(company.industrie);
        var b = this.filters.sectors.includes(company.sector);
        var c = this.filters.activities.includes(company.activity);

        if (!(a && b && c)) {
          company.active = false;
          this.results = this.results.filter(function (i) {
            return i !== company;
          });
        }
      });

      this.showActivePoints();
    },

    initFilters() {
      this.filters.industries = [];
      this.industries.forEach((industrie) => {
        industrie.active = true;

        if (!this.filters.industries.includes(industrie.id)) {
          this.filters.industries.push(industrie.id);
        }
      });

      this.filters.sectors = [];
      this.companies.forEach((company) => {
        const industrie = this.industries.find(
          (industrie) => industrie.id === company.industrie
        );

        if (!industrie.sectors.includes(company.sector)) {
          industrie.sectors.push(company.sector);
        }

        if (!this.filters.sectors.includes(company.sector)) {
          this.filters.sectors.push(company.sector);
        }

        company.active = true;
      });

      this.filters.activities = [];
      this.activities.forEach((activity) => {
        activity.active = true;

        if (!this.filters.activities.includes(activity.id)) {
          this.filters.activities.push(activity.id);
        }
      });

      this.searchValue = "";
    },

    initMarkers() {
      this.markers = new L.MarkerClusterGroup();
      // this.markers = new L.layerGroup();

      this.companies.forEach((company) => {
        const industrie = this.industries.find(
          (industrie) => industrie.id === 0
        );

        company.leafletObject = L.marker(company.coords, {
          icon: industrie.marker,
          title: company.name,
        });
        company.leafletObject.on("click", () => {
          this.companySelected(company.id);
        });
        company.leafletObject.addTo(this.markers);
      });

      this.markers.addTo(this.map);
    },

    initMap() {
      this.map = L.map(this.$refs.map, { zoomControl: false }).setView(
        this.center,
        this.zoom
      );
      L.control.zoom({ position: "bottomright" }).addTo(this.map);
      this.tileLayer = L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );

      this.tileLayer.addTo(this.map);
      setTimeout(() => {
        var resizeEvent = window.document.createEvent("UIEvents");
        resizeEvent.initUIEvent("resize", true, false, window, 0);
        window.dispatchEvent(resizeEvent);
      }, 100);
    },

    // instead of centering the point, move it sightly to the right on desktop
    myMapFlyTo(coordinates, zoom) {
      console.log(coordinates);
      if (!this.isMobile())
        coordinates = [coordinates[0], coordinates[1] - 0.01];
      console.log(coordinates);
      this.map.flyTo(coordinates, zoom);
    },

    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
  },
  watch: {
    locale: function (val) {
      this.$i18n.locale = val;
    },
    searchValue: function () {
      this.searching();
    },
  },
};
</script>

<style>
@import "../node_modules/leaflet/dist/leaflet.css";
@import "../node_modules/leaflet.markercluster/dist/MarkerCluster.css";
@import "../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css";
@import "assets/css/style.css";
@import "assets/css/responsive.css";
</style>
