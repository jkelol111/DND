"use strict"

class DndScheduleManager {
  constructor() {

  }
  setSchedule(beginDndDaily, endDndDaily=undefined, daysToDnd=undefined) {}
  cancelSchedule() {
    if(localStorage.getItem("dnd.enabled"));
  }
}

const scheduler = new DndScheduleManager();

class AppNavigation {
  updateSoftkeyLabel(keysToUpdate) {
    for(var key in keysToUpdate) {
      if(keysToUpdate.hasOwnProperty(key)) {
        document.getElementById("sk_"+key).setAttribute("data-l10n-id", keysToUpdate[key]);
      }
    }
  }
  changeSoftkeys() {
    switch(this.currentContentElement) {
      case 0:
        var centerKey = null;
        if(localStorage.getItem("dnd.enabled")) {
          centerKey = "softkey_off";
        } else {
          centerKey = "softkey_on";
        }
        this.updateSoftkeyLabel({left: "softkey_volumes",
                                 center: centerKey,
                                 right: "softkey_settings"});
        break;
      case 1:
        this.updateSoftkeyLabel({left: "softkey_back",
                                 center: "softkey_select",
                                 right: "softkey_none"})
        break;
    }
  }
  changeHeaderTitle() {
    switch(this.currentContentElement) {
      case 0:
        document.getElementById("h_title").setAttribute("data-l10n-id", "header_title_default");
        break;
      case 1:
        document.getElementById("h_title").setAttribute("data-l10n-id", "header_title_settings");
        break;
    }
  }
  navSoftkeys(direction) {
    switch(direction) {
      case "left":
        this.currentContentElement--;
        break;
      case "right":
        this.currentContentElement++;
        break;
      case "init":
        this.currentContentElement = 0;
        break;
      default:
        throw new Error("Unrecognized direction value '"+direction+"'.");
        break;
    }
    switch(this.currentContentElement) {
      case -1:
        const volumeMixer = new MozActivity({name: "volumes",
                                             data: {}});
        this.currentContentElement = 0;
        break;
      case 0:
        this.contentElements[0].classList.add("transition_blur_out");
        this.contentElements[0].classList.remove("transition_blur_in");
        this.contentElements[1].classList.add("transition_settings_hide");
        this.contentElements[1].classList.remove("transition_settings_show");
        break;
      case 1:
        this.contentElements[0].classList.add("transition_blur_in");
        this.contentElements[0].classList.remove("transition_blur_out");
        this.contentElements[1].classList.add("transition_settings_show");
        this.contentElements[1].classList.remove("transition_settings_hide");
        break;
      case this.contentElements.length:
        this.currentContentElement = 1;
        break;
      default:
        throw new Error("Unrecognized page value '"+direction+"'.");
        break;
    }
    this.changeSoftkeys();
    this.changeHeaderTitle();
  }
  navCenterKey() {
    if(this.currentContentElement == 1){
      naviBoard.getActiveElement().children[1].focus();
      naviBoard.getActiveElement().children[1].onblur = () => {
        naviBoard.getActiveElement().focus();
      }
    } else {
      toggleDnd();
    }
  }
  constructor() {
    this.contentElements = document.querySelectorAll(".content");
    this.currentContentElement = 0;
    naviBoard.setNavigation("settings_container");
    this.navSoftkeys("init");
  }
}

const nav = new AppNavigation();

window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener("keydown", (e) => {
    switch(e.key) {
      case "SoftLeft":
        nav.navSoftkeys("left");
        break;
      case "SoftRight":
        nav.navSoftkeys("right");
        break;
      case "Enter":
        nav.navCenterKey();
        break;
    }
  })
})