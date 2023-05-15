import { Controller } from "@hotwired/stimulus"
import { EventEmitter } from "events"
import GSAP from "gsap"

export default class extends Controller {
  connect() {
    this.number = this.element.querySelector(".preloader__number p")
    this.assets = document.querySelectorAll("img")
    this.allAssetsLoaded = new EventEmitter()
    this.assetsLoadedLength = 0
    this.create()
  }

  create() {
    this.element.classList.add("is-running")

    let timer = 0
    this.assets.forEach((image) => {
      setTimeout(() => {
        image.onloaded = this.onAssetLoaded()
      }, (timer += 75))
    })

    this.allAssetsLoaded.once("completed", this.onAllAssetsLoaded.bind(this))
  }

  onAssetLoaded() {
    this.assetsLoadedLength += 1
    const percent = this.assetsLoadedLength / this.assets.length
    this.number.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      return new Promise((resolve) => {
        const animateOut = GSAP.timeline()
        animateOut.to(this.number, {
          delay: 0.1,
          duration: 0.3,
          ease: "expo.out",
          autoAlpha: 0,
        })
        animateOut.call(() => this.allAssetsLoaded.emit("completed"))
        resolve()
      })
    }
  }

  onAllAssetsLoaded() {
    document.documentElement.classList.add("is-loaded")
    this.destroy()
  }

  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}
