import { EventEmitter } from "events"
import GSAP from "gsap"

export default class Preloader extends EventEmitter {
  constructor() {
    super()

    this.preloader = document.querySelector(".preloader")
    this.preloaderNumber = document.querySelector(".preloader__number p")
    this.assets = document.querySelectorAll("img")
    this.assetsLoadedLength = 0

    this.createLoader()
  }

  createLoader() {
    let timer = 0

    this.assets.forEach((image) => {
      setTimeout(() => {
        image.onloaded = this.onAssetsLoaded()
      }, (timer += 75))
    })
  }

  onAssetsLoaded() {
    this.assetsLoadedLength += 1
    const percent = this.assetsLoadedLength / this.assets.length
    this.preloaderNumber.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = GSAP.timeline()

      this.animateOut.to(this.preloaderNumber, {
        delay: 0.3,
        duration: 0.5,
        ease: "expo.out",
        autoAlpha: 0,
      })

      // once 'completed' is emitted, the listener in app index.js will destroy preloader
      this.animateOut.call(() => this.emit("completed"))
      resolve()
    })
  }

  destroy() {
    this.preloader.parentNode.removeChild(this.preloader)
  }
}
