import { Controller } from "@hotwired/stimulus"
import Preloader from "./preloader-controller.js"

export default class extends Controller {
  connect() {
    console.log("Main controller connected")

    this.createPreloader()
  }

  createPreloader() {
    this.preloader = new Preloader()
    this.preloader.once("completed", this.onPreloaded.bind(this))
  }

  onPreloaded() {
    this.preloader.destroy()
    document.documentElement.classList.add("is-loaded")
  }
}
