'use strict'

try{
function getL10nString(l10nId) {
  document.getElementById("l10nAid").setAttribute("data-l10n-id", l10nId);
  return document.getElementById("l10nAid").textContent;
}

class DndScheduleManager {
  changesSavedCb() {
    navigator.mozL10n.formatValue("toast_changesSaved").then((str) => {
      nativeToast({message: str,
                   position: 'north',
                   timeout: 3000,
                   type: 'success'});
    });
  }
  changesUnsavedCb(err) {
    navigator.mozL10n.formatValue("toast_changesFailed").then((str) => {
      nativeToast({message: str,
                   position: 'north',
                   timeout: 3000,
                   type: 'error'});
    });
    console.error(err);
    throw err;
  }
  cancelSchedule() {
    try {
      var alarms = navigator.mozAlarms.getAll();
      alarms.onsuccess = (e) => {
        e.result.forEach((alarm) => {
          navigator.mozAlarms.remove(alarm.id);
        });
      }
      alarms.onerror = (err) => {
        throw err;
      }
      this.changesSavedCb();
    } catch(err) {
      this.changesUnsavedCb(err);
    }
  }
  setSchedule(beginDndDaily, endDndDaily, daysToDnd) {
    this.cancelSchedule();
    try {
      var emptyStringArray = JSON.stringify([]);
      if(JSON.stringify(beginDndDaily) != emptyStringArray) {
        localStorage.setItem("dnd.schedule.daily.begin", JSON.stringify({hour: beginDndDaily[0],
                                                                         minute: beginDndDaily[1]}));
      } else {
        throw new TypeError("beginDndDaily should not be an empty array.");
      }
      if(JSON.stringify(daysToDnd) != emptyStringArray) {
        localStorage.setItem("dnd.schedule.days", JSON.stringify(daysToDnd));
      } else {
        alert("Please input the days you want Do Not Disturb to be automatically toggled on to enable schedule.")
        throw new TypeError("daysToDnd should not be an empty array.");
      }
      if(JSON.stringify(endDndDaily) != emptyStringArray) {
        localStorage.setItem("dnd.schedule.daily.end", JSON.stringify({hour: endDndDaily[0],
                                                                       minute: endDndDaily[1]}));
      } else {
        throw new TypeError("endDndDaily should not be an empty array.");
      }
      this.changesSavedCb();
    } catch(err) {
      this.changesUnsavedCb(err);
    }
  }
  startSchedule() {

  }
  startNoSchedule() {

  }
}

const scheduler = new DndScheduleManager();

document.getElementById("select_0").onchange = (e) => {
  localStorage.setItem("dnd.mode", e.target.value);
  scheduler.changesSavedCb();
}

document.getElementById("select_1").onchange = (e) => {
  switch(e.target.value) {
    case "true":
      try {
        scheduler.setSchedule(document.getElementById("select_3").value.split(":"),
                              document.getElementById("select_4").value.split(":"),
                              getDaysSelected()["values"]);
      } catch(err) {
        document.getElementById("select_1").value = "false";
      }
      break;
    case "false":
      try {
        scheduler.cancelSchedule();
      } catch(err) {
        document.getElementById("select_1").value = "true";
      }
      break;
    default:
      console.log(e.target.value);
      break;
  }
}

function getDaysSelected() {
  var selectedValue = [];
  var selectedString = "";
  for(var i of document.getElementById("select_2").selectedOptions) {
    selectedValue.push(i.value);
    selectedString += i.label+" ";
  }
  return {values: selectedValue,
          string: selectedString};
}

function select_2_label_update() {
  var selectedObject = getDaysSelected();
  var selectedValues = JSON.stringify(selectedObject["values"]);
  if(selectedValues === JSON.stringify(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])) {
    document.getElementById("select_2_label").setAttribute("data-l10n-id", "settings_dnd_time_days_weekdays");
  } else if (selectedValues === JSON.stringify(["Saturday", "Sunday"])) {
    document.getElementById("select_2_label").setAttribute("data-l10n-id", "settings_dnd_time_days_weekends");
  } else if(selectedValues === JSON.stringify(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])) {
    document.getElementById("select_2_label").setAttribute("data-l10n-id", "settings_dnd_time_days_everyday");
  } else if(selectedValues === JSON.stringify([])) {
    document.getElementById("select_2_label").setAttribute("data-l10n-id", "settings_dnd_time_days_none");
  } else {
    document.getElementById("select_2_label").textContent = selectedObject["string"];
  }
  return selectedValues;
}

document.getElementById("select_2").onchange = (e) => {
  localStorage.setItem("dnd.schedule.days", select_2_label_update());
  scheduler.changesSavedCb();
}

document.getElementById("select_3").onchange = (e) => {
  var timeOn = document.getElementById("select_3").value.split(":");
  localStorage.setItem("dnd.schedule.daily.begin", JSON.stringify({hour: timeOn[0],
                                                                   minute: timeOn[1]}));
  scheduler.changesSavedCb();
}

document.getElementById("select_4").onchange = (e) => {
  var timeOff = document.getElementById("select_4").value.split(":");
  localStorage.setItem("dnd.schedule.daily.end", JSON.stringify({hour: timeOff[0],
                                                                 minute: timeOff[1]}));
  scheduler.changesSavedCb();
}

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
        this.contentElements[1].classList.add("transition_settings_hide");
        this.contentElements[1].classList.remove("transition_settings_show");
        break;
      case 1:
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
        naviBoard.getActiveElement().children[1].blur();
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
  if(localStorage.getItem("dnd.mode") != null) {
    document.getElementById("select_0").value = localStorage.getItem("dnd.mode");
  }
  var storedDays = localStorage.getItem("dnd.schedule.days");
  if(storedDays != null) {
    storedDays = JSON.parse(storedDays);
    for(var value of document.getElementById("select_2").options) {
      if(storedDays.indexOf(value.value) != -1) {
        value.selected = true;
      }
    }
    console.log(select_2_label_update());
    console.log(getDaysSelected());
  } else {
    localStorage.setItem("dnd.schedule.enabled", "false");
  }
  document.getElementById("select_1").value = localStorage.getItem("dnd.schedule.enabled");
  var storedBeginTime = localStorage.getItem("dnd.schedule.daily.begin");
  if(storedBeginTime != null) {
    storedBeginTime = JSON.parse(storedBeginTime);
    document.getElementById("select_3").value = storedBeginTime["hour"]+":"+storedBeginTime["minute"];
  }
  var storedEndTime = localStorage.getItem("dnd.schedule.daily.end");
  if(storedEndTime != null) {
    storedEndTime = JSON.parse(storedEndTime);
    document.getElementById("select_4").value = storedEndTime["hour"]+":"+storedEndTime["minute"];
  }
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
  });
});}catch(err) {console.error(err)}