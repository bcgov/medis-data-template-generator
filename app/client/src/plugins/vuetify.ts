import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// import { fa as FONTAWESOME } from "vuetify/iconsets/fa";

const chefsTheme = {
  dark: false,
  colors: {
    primary: "#003366",
    "surface-variant": "#003366",
    secondary: "#FCBA19",
    anchor: "#1A5A96",
    accent: "#82B1FF",
    error: "#D8292F",
    info: "#2196F3",
    success: "#2E8540",
    warning: "#FFC107",
  },
};

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "chefsTheme",
    themes: {
      chefsTheme,
    },
  },
});
