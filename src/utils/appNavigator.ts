import type { NavigateFunction } from "react-router";

export const appNavigator: { navigate: NavigateFunction | null } = {
  navigate: null,
};

export const setAppNavigator = (navigator: NavigateFunction) => {
  appNavigator.navigate = navigator;
};
