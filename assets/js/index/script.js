document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const header = document.querySelector("header");
  const heroHeader = document.querySelector(".hero-header");
  const heroImg = document.querySelector(".hero-img");
  const canvas = document.getElementById("canvas-hero");
  const context = canvas.getContext("2d");

  const setCanvasSize = () => {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    context.scale(pixelRatio, pixelRatio);
  };
  setCanvasSize();

  const frameCount = 280;
  const currentFrame = (index) =>
    `./assets/images/frame_img/frame_${(index + 1).toString()}.jpg`;

  let images = [];
  let videoFrames = { frame: 0 };
  let imagesToLoad = frameCount;

  const onLoad = () => {
    imagesToLoad--;
    if (!imagesToLoad) {
      render();
      setupScrollTrigger();
    }
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = onLoad;
    img.onerror = function () {
      onLoad.call(this);
    };
    img.src = currentFrame(i);
    images.push(img);
  }

  const render = () => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const img = images[videoFrames.frame];
    console.log(`Rendering frame ${videoFrames.frame}`, img);

    if (img && img.complete && img.naturalWidth > 0) {
      const imageAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (imageAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imageAspect;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imageAspect;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
      }
      context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }
  };
  const setupScrollTrigger = () => {
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: `=${window.innerHeight * 7}px`,
      pin: true,
      scrub: 1,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const animationProgress = Math.min(progress / 0.6, 1);
        const targetFrame = Math.round(animationProgress * (frameCount - 1));
        videoFrames.frame = targetFrame;
        render();
        if (progress <= 0.1) {
          const headerProgress = progress / 0.1;
          const opacity = 1 - headerProgress;
          gsap.set(header, { opacity });
        } else {
          gsap.set(header, { opacity: 0 });
        }
        if (progress <= 0.25) {
          const zProgress = progress / 0.25;
          const translateZ = zProgress * -500;
          let opacity = 1;
          if (progress >= 0.2) {
            const fadeProgress = Math.min((progress - 0.2) / (0.25 - 0.2), 1);
            opacity = 1 - fadeProgress;
          }
          gsap.set(heroHeader, {
            opacity,
            transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
          });
        } else {
          gsap.set(heroHeader, { opacity: 0 });
        }
        // ============
        if (progress < 0.6) {
          gsap.set(heroImg, {
            transform: "translateZ(1000px)",
            opacity: 0,
          });
        } else if (progress >= 0.6 && progress <= 0.9) {
          const imgProgress = (progress - 0.6) / 0.3;
          const translateZ = 1000 - imgProgress * 1000;

          let opacity = 0;
          if (progress <= 0.8) {
            const opacityProgress = (progress - 0.6) / 0.2;
            opacity = opacityProgress;
          } else {
            opacity = 1;
          }
          gsap.set(heroImg, {
            transform: `translateZ(${translateZ}px)`,
            opacity,
          });
        } else {
          gsap.set(heroImg, {
            transform: "translateZ(0px)",
            opacity: 1,
          });
        }
      },
    });
  };
  window.addEventListener("resize", setCanvasSize);
  setCanvasSize();
  render();
  ScrollTrigger.refresh();
});
