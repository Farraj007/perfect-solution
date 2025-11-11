document.body.style.overflowY = "hidden"
import {
    ViewerApp,
    AssetManagerPlugin,
    timeout,
    SSRPlugin,
    mobileAndTabletCheck,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSAOPlugin,
    GroundPlugin,
    FrameFadePlugin,
    DiamondPlugin,
    // DepthOfFieldPlugin,
    BufferGeometry,
    MeshStandardMaterial2,
    BloomPlugin, 
    TemporalAAPlugin, 
    RandomizedDirectionalLightPlugin, 
    AssetImporter, 
    Color, 
    Mesh
} from "webgi"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from '@studio-freight/lenis'

import "./styles.scss"

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
    duration: 2.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -5 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    mouseMultiplier: 1,
  })
  
function raf(time: Number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
  
requestAnimationFrame(raf)

type FurnitureConfig = {
    path: string
    rootName: string
    frameNames: string[]
    seatNames: string[]
    initialRotation?: [number, number, number]
}

const furnitureConfigs: Record<number, FurnitureConfig> = {
    1: {
        path: "./assets/office_chair.glb",
        rootName: "Sketchfab_model",
        frameNames: ['Object_2'],
        seatNames: ['Object_3']
    },
    2: {
        path: "./assets/perfect_solution_chair_executive.glb",
        rootName: "Sketchfab_model",
        frameNames: [
            'Plane.002_Material.011_0',
            'Cylinder.008_Material.017_0',
            'Cylinder.007_Material.017_0',
            'Cylinder.006_Material.017_0',
            'Cylinder.005_Material.017_0',
            'Cylinder.004_Material.017_0',
            'Cylinder.001_Material.013_0',
            'Cylinder_Material.016_0',
            'Cylinder_Material.015_0'
        ],
        seatNames: [
            'Cube.014_Material.013_0',
            'Cube.013_Material.010_0',
            'Cube.013_Material.011_0',
            'Cube.012_Material.010_0',
            'Cube.012_Material.011_0',
            'Cube.011_Material.011_0',
            'Cube.008_Material.018_0',
            'Cube.007_Material.011_0',
            'Cube.006_Material.018_0',
            'Cube.005_Material.018_0',
            'Cube.004_Material.018_0',
            'Cube.003_Material.018_0'
        ],
        initialRotation: [0, 0, 0]
    }
}

type SupportedLang = 'en' | 'ar'

const translations: Record<SupportedLang, Record<string, string>> = {
    en: {
        'hero.description': 'Luxury woodworking workshops delivering executive offices, signature seating, and couture kitchens crafted to the millimeter.',
        'hero.pill1': 'Executive desks',
        'hero.pill2': 'Ergonomic chairs',
        'hero.pill3': 'Bespoke kitchens',
        'cta.whatsapp': 'WhatsApp us',
        'cta.call': 'Call +962 7 9702 0156',
        'section2.h2': 'engineered to last',
        'section2.h1': 'Work<br>Better',
        'section2.p': 'We mill, assemble, and finish every element in-house: acoustic walls, wood offices, concierge desks, and custom kitchens that age gracefully under years of use.',
        'section3.h2': 'configure your',
        'section3.h1': 'Signature pieces',
        'section3.p': 'Switch upholstery tones, blend metal finishes, or swap the featured model. The Perfect Solution factory is ready for your boardroom and your kitchen suite.',
        'form.name': 'Name',
        'form.phone': 'Phone',
        'form.message': 'Message',
        'form.button': 'Reach out to us',
        'gallery.executive': 'Executive suite',
        'gallery.palette': 'Design palette',
        'gallery.lobby': 'Lobby signage',
        'gallery.showroom': 'Showroom',
        'showroom.title': 'Showroom gallery',
        'showroom.subtitle': 'Explore recent Perfect Solution builds.',
        'showroom.tab.chairs': 'Chairs',
        'showroom.tab.offices': 'Offices',
        'showroom.tab.kitchens': 'Kitchens',
        'showroom.chair1': 'Ergonomic chair promo',
        'showroom.chair2': 'Headrest comfort',
        'showroom.chair3': 'Mesh support',
        'showroom.office1': 'Executive boardroom',
        'showroom.office2': 'Lobby check-in desk',
        'showroom.kitchen1': 'Concept kitchen palette',
        'showroom.kitchen2': 'Entry branding',
        'showroom.kitchen3': 'Materials library'
    },
    ar: {
        'hero.description': 'نقدّم ورش نجارة فاخرة تنجز المكاتب التنفيذية والكراسي المريحة والمطابخ المخصّصة بدقة متناهية.',
        'hero.pill1': 'مكاتب تنفيذية',
        'hero.pill2': 'كراسي مريحة',
        'hero.pill3': 'مطابخ حسب الطلب',
        'cta.whatsapp': 'تواصل عبر واتساب',
        'cta.call': 'اتصل على ‎+962 7 9702 0156',
        'section2.h2': 'مصممة لتدوم',
        'section2.h1': 'اعمل<br>بإتقان',
        'section2.p': 'نقوم بالتصنيع والتجميع والتشطيب داخل مصنعنا لكل عنصر من الجدران الصوتية إلى المكاتب والمطابخ التي تحافظ على جمالها لسنوات.',
        'section3.h2': 'خصص رؤيتك',
        'section3.h1': 'قطعك المميزة',
        'section3.p': 'بدّل ألوان التنجيد وامزج التشطيبات المعدنية أو اختر نموذجاً آخر؛ المصنع جاهز لغرف الاجتماعات والمطابخ الفاخرة.',
        'form.name': 'الاسم',
        'form.phone': 'رقم الهاتف',
        'form.message': 'الرسالة',
        'form.button': 'تواصل معنا',
        'gallery.executive': 'جناح تنفيذي',
        'gallery.palette': 'لوحة التصميم',
        'gallery.lobby': 'لافتة الاستقبال',
        'gallery.showroom': 'صالة العرض',
        'showroom.title': 'معرض الأعمال',
        'showroom.subtitle': 'استكشف أحدث مشاريع بيرفكت سوليوشن.',
        'showroom.tab.chairs': 'كراسي',
        'showroom.tab.offices': 'مكاتب',
        'showroom.tab.kitchens': 'مطابخ',
        'showroom.chair1': 'عرض كرسي مريح',
        'showroom.chair2': 'راحة مع مسند رأس',
        'showroom.chair3': 'شبك داعم',
        'showroom.office1': 'غرفة اجتماعات تنفيذية',
        'showroom.office2': 'مكتب استقبال',
        'showroom.kitchen1': 'لوحة ألوان المطبخ',
        'showroom.kitchen2': 'علامة المدخل',
        'showroom.kitchen3': 'مكتبة المواد'
    }
}

const placeholderTranslations: Record<SupportedLang, Record<string, string>> = {
    en: {
        'form.namePlaceholder': 'Your name',
        'form.phonePlaceholder': '+962 ...',
        'form.messagePlaceholder': 'Project notes'
    },
    ar: {
        'form.namePlaceholder': 'اكتب اسمك',
        'form.phonePlaceholder': 'أدخل رقمك',
        'form.messagePlaceholder': 'صف مشروعك'
    }
}

let currentLang: SupportedLang = 'en'
let usingCustomColors = false
let modelRadius = 3

async function setupViewer(){

    const canvas = document.getElementById('webgi-canvas') as HTMLCanvasElement
    const isMobile = mobileAndTabletCheck()
    const deviceMemory = (navigator as any).deviceMemory ?? 8
    const lowSpecDevice = isMobile || deviceMemory <= 4 || window.innerWidth < 1280

    const viewer = new ViewerApp({
        canvas,
        useGBufferDepth: !lowSpecDevice,
        isAntialiased: !lowSpecDevice
    })

    const cappedPixelRatio = Math.min(window.devicePixelRatio || 1, 1)
    viewer.renderer.displayCanvasScaling = lowSpecDevice ? Math.min(cappedPixelRatio, 0.85) : cappedPixelRatio

    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Interface Elements
    const exploreView = document.querySelector('.cam-view-3') as HTMLElement
    const canvasView = document.getElementById('webgi-canvas') as HTMLElement
    const canvasContainer = document.getElementById('webgi-canvas-container') as HTMLElement
    const exitContainer = document.querySelector('.exit--container') as HTMLElement
    const loaderElement = document.querySelector('.loader') as HTMLElement
    const gemMenu =  document.querySelector('.gem--menu') as HTMLElement
    const footerContainer = document.querySelector('.footer--container') as HTMLElement
    const materialsMenu = document.querySelector('.materials--menu') as HTMLElement
    const configMaterial = document.querySelector('.config--material') as HTMLElement
    const configGem = document.querySelector('.config--gem') as HTMLElement
    const closeConfigMaterial = document.querySelector('.close-materials') as HTMLElement
    const configRing = document.querySelector('.config--ring') as HTMLElement
    const closeConfigGem = document.querySelector('.close-gems') as HTMLElement
    const sidebar = document.querySelector('.side-bar') as HTMLElement 
    let nightMode = false
    let firstLooad = true
    let ringModel = 1

    const highQualityPipeline = !lowSpecDevice

    // Add WEBGi plugins
    if(highQualityPipeline){
        await viewer.addPlugin(GBufferPlugin)
    }
    await viewer.addPlugin(new ProgressivePlugin(highQualityPipeline ? 32 : 16))
    await viewer.addPlugin(new TonemapPlugin(true, false,
        [
          `// This part is added before the main function in tonemap pass.
            vec4 vignette(vec4 color, vec2 uv, float offset, float darkness){
                uv = ( uv - vec2( 0.5 ) ) * vec2( offset );
                return vec4( mix( color.rgb, vec3( 0.17, 0.00, 0.09 ), dot( uv, uv ) ), color.a );
            }`,
            // This part is added inside main function after tonemapping before encoding conversion.
            `gl_FragColor = vignette(gl_FragColor, vUv, 1.1, 0.8);`
        ])
     )
    await viewer.addPlugin(FrameFadePlugin)
    await viewer.addPlugin(GroundPlugin)
    let ssr: SSRPlugin | undefined
    let ssao: SSAOPlugin | undefined
    let bloom: BloomPlugin | undefined

    if(highQualityPipeline){
        ssr = await viewer.addPlugin(SSRPlugin)
        ssao = await viewer.addPlugin(SSAOPlugin)
        bloom = await viewer.addPlugin(BloomPlugin)
        await viewer.addPlugin(TemporalAAPlugin)
        await viewer.addPlugin(DiamondPlugin)
    } else {
        bloom = await viewer.addPlugin(BloomPlugin)
        if(bloom){
            bloom.enabled = false
        }
    }
    // const dof = await viewer.addPlugin(DepthOfFieldPlugin)
    await viewer.addPlugin(RandomizedDirectionalLightPlugin, false)
    viewer.setBackground(new Color('#14221a').convertSRGBToLinear())

    if(ssr){
        ssr.passes.ssr.passObject.lowQualityFrames = 0
    }
    if(bloom?.pass){
        bloom.pass.passObject.bloomIterations = highQualityPipeline ? 2 : 1
    }
    if(ssao){
        ssao.passes.ssao.passObject.material.defines.NUM_SAMPLES = highQualityPipeline ? 4 : 2
    }

    // WEBGi loader
    const importer = manager.importer as AssetImporter

    importer.addEventListener("onStart", (ev) => {
        // onUpdate()
    })

    importer.addEventListener("onProgress", (ev) => {
        const progressRatio = (ev.loaded / ev.total)
        document.querySelector('.progress')?.setAttribute('style',`transform: scaleX(${progressRatio})`)
    })

    importer.addEventListener("onLoad", (ev) => {
        if(firstLooad){
            introAnimation()
        } else{
            gsap.to('.loader', {x: '100%', duration: 0.8, ease: "power4.inOut", delay: 1})
        }
    })

    viewer.renderer.refreshPipeline()


    // WEBGi load model
    let ring: Mesh<BufferGeometry, MeshStandardMaterial2>
    let frameMeshes: Mesh<BufferGeometry, MeshStandardMaterial2>[] = []
    let seatMeshes: Mesh<BufferGeometry, MeshStandardMaterial2>[] = []

    await importFurnitureModel(ringModel, true)


    if(camera.controls){
        camera.controls!.enabled = false
    } 

    // WEBGi mobile adjustments
    if(isMobile){
        if(ssr){
            ssr.passes.ssr.passObject.stepCount /= 2
        }
        if(bloom){
            bloom.enabled = false
        }
        camera.setCameraOptions({fov:65})
    }

    window.scrollTo(0,0)

    await timeout(50)

    async function importFurnitureModel(modelId: number, isInitial = false){
        const config = furnitureConfigs[modelId]
        if(!config) return
        if(!isInitial){
            viewer.scene.removeSceneModels()
        }
        await manager.addFromPath(config.path)
        applyModelConfig(config)
    }

    function applyModelConfig(config: FurnitureConfig){
        const rootCandidate = viewer.scene.findObjectsByName(config.rootName)[0]
        ring = (rootCandidate ?? viewer.scene.modelRoot) as any as Mesh<BufferGeometry, MeshStandardMaterial2>
        frameMeshes = collectMeshes(config.frameNames)
        seatMeshes = collectMeshes(config.seatNames)
        if(config.initialRotation){
            ring.rotation.set(config.initialRotation[0], config.initialRotation[1], config.initialRotation[2])
        }
        normalizeModelScale()
        setInitialCameraPose()
    }

    function collectMeshes(names: string[]){
        const meshes: Mesh<BufferGeometry, MeshStandardMaterial2>[] = []
        names.forEach(name => {
            const found = viewer.scene.findObjectsByName(name)
            if(found.length){
                found.forEach(obj => meshes.push(obj as Mesh<BufferGeometry, MeshStandardMaterial2>))
            }
        })
        return meshes
    }

    function normalizeModelScale(){
        const bounds = viewer.scene.getBounds(true, true)
        const initialSize = {
            x: bounds.max.x - bounds.min.x,
            y: bounds.max.y - bounds.min.y,
            z: bounds.max.z - bounds.min.z,
        }
        const maxDim = Math.max(initialSize.x, initialSize.y, initialSize.z) || 1
        const targetSize = 3.2
        const scale = targetSize / maxDim
        ring.scale.setScalar(scale)
        ring.updateMatrixWorld(true)
        const scaledBounds = viewer.scene.getBounds(true, true)
        const center = {
            x: (scaledBounds.max.x + scaledBounds.min.x) / 2,
            y: (scaledBounds.max.y + scaledBounds.min.y) / 2,
            z: (scaledBounds.max.z + scaledBounds.min.z) / 2,
        }
        ring.position.set(ring.position.x - center.x, ring.position.y - center.y, ring.position.z - center.z)
        ring.updateMatrixWorld(true)
        const finalBounds = viewer.scene.getBounds(true, true)
        const finalSize = {
            x: finalBounds.max.x - finalBounds.min.x,
            y: finalBounds.max.y - finalBounds.min.y,
            z: finalBounds.max.z - finalBounds.min.z,
        }
        modelRadius = Math.max(finalSize.x, finalSize.y, finalSize.z) * 0.5
        viewer.scene.setDirty({sceneUpdate: true})
    }

    function setInitialCameraPose(){
        target.set(0, 0, 0)
        position.set(modelRadius * 0.9, modelRadius * 0.35, modelRadius * 3)
        camera.positionUpdated(true)
        camera.targetUpdated(true)
    }

    function introAnimation(){
        firstLooad = false
        const introTL = gsap.timeline()
        introTL
        .to('.loader', {x: '100%', duration: 0.8, ease: "power4.inOut", delay: 1})
        .fromTo(position, {x: isMobile ? 3 : 3, y: isMobile ? -0.8 : -0.8, z: isMobile ? 1.2 : 1.2}, {x: isMobile ? 1.28 : 1.28, y: isMobile ? -1.7 : -1.7, z: isMobile ? 5.86 : 5.86, duration: 4, onUpdate}, '-=0.8')
        .fromTo(target, {x: isMobile ? 2.5 : 2.5, y: isMobile ? -0.07 : -0.07, z: isMobile ? -0.1 : -0.1}, {x: isMobile ? -0.21 : 0.91, y: isMobile ? 0.03 : 0.03, z: isMobile ? -0.25 : -0.25, duration: 4, onUpdate}, '-=4')
        .fromTo('.header--container', {opacity: 0, y: '-100%'}, {opacity: 1, y: '0%', ease: "power1.inOut", duration: 0.8}, '-=1')
        .fromTo('.hero--scroller', {opacity: 0, y: '150%'}, {opacity: 1, y: '0%', ease: "power4.inOut", duration: 1}, '-=1')
        .fromTo('.hero--container', {opacity: 0, x: '100%'}, {opacity: 1, x: '0%', ease: "power4.inOut", duration: 1.8, onComplete: setupScrollAnimation}, '-=1')
        .fromTo('.side-bar', { opacity: 0, x: '50%' }, { opacity: 1, x: '0%', ease: "power4.inOut", duration: 2 }, '-=1')
        .to('.side-bar .unique', { opacity: 1, scale: 1.5, ease: "power4.inOut", duration: 2}, '-=1')
    }

    function setupScrollAnimation(){
        document.body.style.overflowY = "scroll"
        // document.body.removeChild(loaderElement)

        // customScrollingEnabled = true

        const tl = gsap.timeline({ default: {ease: 'none'}})

        // FOREVER
        tl.to(position, {x: -1.83, y: -0.14, z: 6.15,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate
        })

        .to(target,{x: isMobile ? 0 : -0.78, y: isMobile ? 1.5 : -0.03, z: -0.12,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }
        })
        .to(ring.rotation,{x: (ringModel == 1) ? -0.15 : -0.1, y: (ringModel == 1) ? 0.3 : -0.25 , z: 0,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }
        })
        .fromTo(colorLerpValue, {x:0}, {x:1,
            scrollTrigger: { trigger: ".cam-view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }
            , onUpdate: function() {
                if(!usingCustomColors){
                    const frameStart = new Color(0x1f1f1f).convertSRGBToLinear()
                    const frameEnd = new Color(0x1c5b42).convertSRGBToLinear()
                    frameMeshes.forEach(mesh => mesh.material.color.lerpColors(frameStart, frameEnd, colorLerpValue.x))

                    const seatStart = new Color(0x2f2f2f).convertSRGBToLinear()
                    const seatEnd = new Color(0xe5cfa0).convertSRGBToLinear()
                    seatMeshes.forEach(mesh => mesh.material.color.lerpColors(seatStart, seatEnd, colorLerpValue.x))
                }
        }})
        .to('.hero--scroller', {opacity: 0, y: '150%',
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: "top center", scrub: 1, immediateRender: false, pin: '.hero--scroller--container'
        }})

        .to('.hero--container', {opacity: 0, xPercent: '100', ease: "power4.out",
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: "top top", scrub: 1, immediateRender: false,
        }})

        .to('.forever--text-bg', {opacity: 0.1, ease: "power4.inOut",
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false,
        }})

        .fromTo('.forever--container', {opacity: 0, x: '-110%'}, {opacity: 1, x: '0%', ease: "power4.inOut",
            scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false,
        }})
        .addLabel("Forever")
        .to('.side-bar .unique', { opacity: 0.5, scale: 1, ease: "power4.inOut", duration: 2, scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false,}})
        .to('.side-bar .forever', { opacity: 1, scale: 1.5, ease: "power4.inOut", duration: 2, scrollTrigger: { trigger: ".cam-view-2", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false}})


        // // EMOTIONS SECTION
        .to(position,  {x: -0.06, y: -1.15, z: 4.42,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false,
        }, onUpdate
        })
        .to(target, {x: -0.01, y: 0.9, z: 0.07,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate
        })
        .to(ring.rotation,{x: (ringModel == 1) ? 0 : 0.05 , y:(ringModel == 1) ? -0.1 : 0.15, z: 0,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }
        })
        .fromTo(colorLerpValue2, {x:0}, {x:1,
            scrollTrigger: { trigger: ".cam-view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }
            , onUpdate: function() {
   
                
                if(!usingCustomColors){
                    const frameStart = new Color(0x1c5b42).convertSRGBToLinear()
                    const frameEnd = new Color(0x272727).convertSRGBToLinear()
                    frameMeshes.forEach(mesh => mesh.material.color.lerpColors(frameStart, frameEnd, colorLerpValue2.x))

                    const seatStart = new Color(0xe5cfa0).convertSRGBToLinear()
                    const seatEnd = new Color(0x2c6c4c).convertSRGBToLinear()
                    seatMeshes.forEach(mesh => mesh.material.color.lerpColors(seatStart, seatEnd, colorLerpValue2.x))
                }
        }})
        .to('.forever--container', {opacity: 0, x: '-110%', ease: "power4.inOut",
            scrollTrigger: { trigger: ".cam-view-3", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false
        }})
        .to('.emotions--text-bg', {opacity: 0.1, ease: "power4.inOut",
            scrollTrigger: { trigger: ".cam-view-3", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false,
        }})
        .fromTo('.emotions--content', {opacity: 0, y: '130%'}, {opacity: 1, y: '0%', duration: 0.5, ease: "power4.inOut",
            scrollTrigger: { trigger: ".cam-view-3", start: "top bottom", end: "top top", scrub: 1, immediateRender: false
        }})
        
        .addLabel("Emotions")
        .to('.side-bar .forever', { opacity: 0.5, scale: 1, ease: "power4.inOut", duration: 2, scrollTrigger: { trigger: ".cam-view-3", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false,}})
        .to('.side-bar .emotions', { opacity: 1, scale: 1.5, ease: "power4.inOut", duration: 2, scrollTrigger: { trigger: ".cam-view-3", start: "top bottom", end: 'top top', scrub: 1, immediateRender: false}})

    }

    let needsUpdate = true;
    function onUpdate(){
        needsUpdate = true;
    }

    // if(!isMobile){
    //     const sections = document.querySelectorAll('.section')
    //     const sectionTops: number[] = []
    //     sections.forEach(section=> {
    //         sectionTops.push(section.getBoundingClientRect().top)
    //     })
    //     setupCustomWheelSmoothScrolling(viewer, document.documentElement, sectionTops, )
    // }
    // else {
    //     createStyles(`
    //         .section-wrapper {
    //         scroll-snap-type: y mandatory;
    //         }

    //     `)
    // }

    viewer.addEventListener('preFrame', ()=>{
        // console.log(ring.rotation)
        if(needsUpdate){
            camera.positionUpdated(false)
            camera.targetUpdated(true)
            needsUpdate = false;
        }
    })

    // KNOW MORE EVENT
    document.querySelector('.button-scroll')?.addEventListener('click', () => {
        const element = document.querySelector('.cam-view-2')
        window.scrollTo({top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth'})
    })

    document.querySelector('.forever')?.addEventListener('click', () => {
        const element = document.querySelector('.cam-view-2')
        window.scrollTo({top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth'})
    })

    document.querySelector('.hero--scroller')?.addEventListener('click', () => {
        const element = document.querySelector('.cam-view-2')
        window.scrollTo({top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth'})
    })

    // CUSTOMIZE EVENT
    document.querySelector('.btn-customize')?.addEventListener('click', () => {
        exploreView.style.pointerEvents = "none"
        canvasView.style.pointerEvents = "all"
        canvasContainer.style.zIndex = "1"
        document.body.style.overflowY = "hidden"
        document.body.style.cursor = "grab"
        sidebar.style.display = "none"
        footerContainer.style.display = "flex"
        configAnimation()

        if (!musicPlay) {
            audio.play()
            audio.volume = 0.1
            audio.loop = true
            musicPlay = true
            
        }
        // customScrollingEnabled = false
    })
    const tlExplore = gsap.timeline()

    function configAnimation(){
        lenis.stop()

        tlExplore.to(position,{x: -0.17, y: -0.25, z: 8.5, duration: 2.5, onUpdate})
        .to(target, {x: 0, y: 0, z: 0, duration: 2.5, onUpdate}, '-=2.5')

        .to(ring.rotation,{x: -0.05, y: (ringModel == 1) ? 0.2 : -0.2, z: 0, duration: 2.5}, '-=2.5')
        .to('.emotions--content', {opacity: 0, x: '130%', duration: 1.5, ease: "power4.out", onComplete: onCompleteConfigAnimation}, '-=2.5')
        .fromTo('.footer--menu',{opacity: 0, y:'150%'}, {opacity: 1, y: '0%', duration: 1.5})

    }

    let colorLerpValue = {x: 0}
    let colorLerpValue2 = {x: 0}

    function onCompleteConfigAnimation(){
        exitContainer.style.display = "flex"
        if(camera.controls){
            camera.controls.enabled = true
            camera.controls.autoRotate = true
            camera.controls.minDistance = 5
            camera.controls.maxDistance = 13
            camera.controls.enablePan = false
            camera.controls.screenSpacePanning = false
        }
        // dof.pass!.passObject.enabled = false

    }


    document.querySelector('.button--exit')?.addEventListener('click', () => {
        exploreView.style.pointerEvents = "all"
        canvasView.style.pointerEvents = "none"
        canvasContainer.style.zIndex = "unset"
        document.body.style.overflowY = "auto"
        exitContainer.style.display = "none"
        document.body.style.cursor = "auto"
        sidebar.style.display = "block"
        footerContainer.style.display = "none"
        exitConfigAnimation()

        // customScrollingEnabled = true;
    })

    const tlExit = gsap.timeline()

    // EXIT EVENT
    function exitConfigAnimation(){

        if(camera.controls){
            camera.controls.enabled = true
            camera.controls.autoRotate = false
            camera.controls.minDistance = 0
            camera.controls.maxDistance = Infinity
        }

        lenis.start()
        
        // dof.pass!.passObject.enabled = true

        gemMenu.classList.remove('show')
        materialsMenu.classList.remove('show')
        if (document.querySelector('.footer--menu li.active')){
            document.querySelector('.footer--menu li.active')?.classList.remove('active')
        }

        tlExit.to(position,{x: -0.06, y: -1.15, z: 4.42, duration: 1.2, ease: "power4.out", onUpdate})
        .to(target, {x: -0.01, y: 0.9, z: 0.07, duration: 1.2, ease: "power4.out"}, '-=1.2')
        // .to(ring.rotation,{x: (ringModel == 1) ? 0 : Math.PI , y:0, z: 0}, '-=1.2') // funciona quando o default e 2
        .to(ring.rotation,{x: 0 , y: (ringModel == 1) ? -0.1 : 0.15, z: 0}, '-=1.2')
        .to('.footer--menu',{opacity: 0, y:'150%'}, '-=1.2')
        .to('.emotions--content', {opacity: 1, x: '0%', duration: 0.5, ease: "power4.out"}, '-=1.2')

    }

    // NIGHT MODE
    document.querySelector('.night--mode')?.addEventListener('click', () => {
        toggleNightMode()
    })
    document.querySelector('.night--mode--2')?.addEventListener('click', () => {
        toggleNightMode()
    })

    function toggleNightMode(){
        if(!nightMode){
            document.body.classList.add('white-theme')
            viewer.setBackground(new Color('#f3eee2').convertSRGBToLinear())
            nightMode = true
        } else{
            document.body.classList.remove('white-theme')
            viewer.setBackground(new Color('#d0b36a').convertSRGBToLinear())
            nightMode = false
        }
    }

    // GEM MENU
    configGem.addEventListener('click', () => {
        gemMenu.classList.add('show')
        materialsMenu.classList.remove('show')

        const gemCameraAnimation = gsap.timeline()

        gemCameraAnimation.to(position, {x: 1.6, y: 3.66, z: 2.55, duration: 1.5, onUpdate})
        .to(target,{x: isMobile ? 0 : -0.01, y: isMobile ? 0.5 : 0.89, z: -0.09, duration: 1.5}, '-=1.5')
        
        if (document.querySelector('.footer--menu li.active')){
            document.querySelector('.footer--menu li.active')?.classList.remove('active')
        }
        configGem.parentElement?.classList.add('active')
    })

    // DIAMOND COLORS
    document.querySelector('.ruby')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#131313'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.ruby')?.classList.add('active')
    })
    document.querySelector('.faint')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#362417'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.faint')?.classList.add('active')
     })
     document.querySelector('.fancy')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#5a3b24'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.fancy')?.classList.add('active')
     })
     
     document.querySelector('.aqua')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#0f4c3a'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.aqua')?.classList.add('active')
     })
     document.querySelector('.swiss')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#0d3533'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.swiss')?.classList.add('active')
     })
     document.querySelector('.yellow')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#c7a35c'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.yellow')?.classList.add('active')
     })
     document.querySelector('.orange')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#a45a2a'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.orange')?.classList.add('active')
     })
     document.querySelector('.green')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#4f6b52'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.green')?.classList.add('active')
     })
     document.querySelector('.emerald')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#1f5a32'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.emerald')?.classList.add('active')
     })
     document.querySelector('.rose')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#d8c4a3'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.rose')?.classList.add('active')
     })
     document.querySelector('.violet')?.addEventListener('click', () => {
        changeUpholsteryColor(new Color('#343638'))
        document.querySelector('.colors--list li.active')?.classList.remove('active')
        document.querySelector('.violet')?.classList.add('active')
     })

    // CHANGE DIAMOND COLOR
    function changeUpholsteryColor(_seatColor: Color){
        const upholsteryColor = _seatColor.clone().convertSRGBToLinear()
        seatMeshes.forEach(mesh => {
            mesh.material.color.copy(upholsteryColor)
        })
        usingCustomColors = true
    }


    // MATERIALS MENU
    configMaterial.addEventListener('click', () => {
        materialsMenu.classList.add('show')
        gemMenu.classList.remove('show')
        gsap.timeline().to(position,{x: -0.17, y: -0.25, z: 8.5, duration: 2.5, onUpdate})
        .to(target, {x: 0, y: 0, z: 0, duration: 2.5, onUpdate}, '-=2.5')
        
        if (document.querySelector('.footer--menu li.active')){
            document.querySelector('.footer--menu li.active')?.classList.remove('active')
        }
        configMaterial.parentElement?.classList.add('active')
    })

    // MATERIALS COLOR
    document.querySelector('.default')?.addEventListener('click', () => {
        changeMaterialColor(new Color(0x0e0e0e),new Color(0x2a2a2a))
        document.querySelector('.materials--list li.active')?.classList.remove('active')
        document.querySelector('.default')?.classList.add('active')
     })
    document.querySelector('.silver-gold')?.addEventListener('click', () => {
        changeMaterialColor(new Color(0x191919), new Color(0xc7a35c))
        document.querySelector('.materials--list li.active')?.classList.remove('active')
        document.querySelector('.silver-gold')?.classList.add('active')
     })
     
    document.querySelector('.silver-silver')?.addEventListener('click', () => {
        changeMaterialColor(new Color(0x8c8b88), new Color(0xd7dad7))
        document.querySelector('.materials--list li.active')?.classList.remove('active')
        document.querySelector('.silver-silver')?.classList.add('active')
     })
    
    document.querySelector('.gold-gold')?.addEventListener('click', () => {
        changeMaterialColor(new Color(0xb98c3a), new Color(0xd7b166))
        document.querySelector('.materials--list li.active')?.classList.remove('active')
        document.querySelector('.gold-gold')?.classList.add('active')
     })
    document.querySelector('.rose-silver')?.addEventListener('click', () => {
        changeMaterialColor(new Color(0x4d2f1c), new Color(0xf1e3cf))
        document.querySelector('.materials--list li.active')?.classList.remove('active')
        document.querySelector('.rose-silver')?.classList.add('active')
    })
    document.querySelector('.gold-rose')?.addEventListener('click', () => {
        changeMaterialColor(new Color(0x0e1f1d), new Color(0x1a5a3f))
        document.querySelector('.materials--list li.active')?.classList.remove('active')
        document.querySelector('.gold-rose')?.classList.add('active')
    })
    document.querySelector('.rose-rose')?.addEventListener('click', () => {
        changeMaterialColor(new Color(0x4a3325), new Color(0x7a5a3a))
        document.querySelector('.materials--list li.active')?.classList.remove('active')
        document.querySelector('.rose-rose')?.classList.add('active')
    })

    // CHANGE MATERIAL COLOR
    function changeMaterialColor(_frameColor: Color, _seatColor: Color){
        const frameColor = _frameColor.clone().convertSRGBToLinear()
        const seatColor = _seatColor.clone().convertSRGBToLinear()
        frameMeshes.forEach(mesh => mesh.material.color.copy(frameColor))
        seatMeshes.forEach(mesh => mesh.material.color.copy(seatColor))
        usingCustomColors = true
    }

    // CLOSE GEM MENU
    closeConfigGem.addEventListener('click', () => {
        gemMenu.classList.remove('show')

        gsap.timeline().to(position,{x: -0.17, y: -0.25, z: 8.5, duration: 2.5, onUpdate})
        .to(target, {x: 0, y: 0, z: 0, duration: 2.5, onUpdate}, '-=2.5')
       
        if (document.querySelector('.footer--menu li.active')){
            document.querySelector('.footer--menu li.active')?.classList.remove('active')
        }
    })

    // CLOSE MATERIAL MENU
    closeConfigMaterial.addEventListener('click', () => {
        materialsMenu.classList.remove('show')
       
        if (document.querySelector('.footer--menu li.active')){
            document.querySelector('.footer--menu li.active')?.classList.remove('active')
        }
    })

    // CHANGE RING
    configRing.addEventListener('click', () => {

        gsap.to('.loader', {x: '0%', duration: 0.8, ease: "power4.inOut", onComplete: () =>{
            loadNewModel()
        }})
           
        if (document.querySelector('.footer--menu li.active')){
            document.querySelector('.footer--menu li.active')?.classList.remove('active')
        }
    })

    async function loadNewModel(){
        const nextModel = ringModel === 1 ? 2 : 1
        await importFurnitureModel(nextModel)
        ringModel = nextModel
        gsap.to('.loader', {x: '100%', duration: 0.8, ease: "power4.inOut", delay: 1})

        if(camera.controls){
            camera.controls.autoRotate = true
            camera.controls.minDistance = 5
            camera.controls.maxDistance = 13
            camera.controls.enablePan = false
            camera.controls.screenSpacePanning = false
        }
    }
}



/////////////////////////////////////////////////////////////////////////
///// BACKGROUND MUSIC
let firstPlay = true
let audio = new Audio();
audio.src = './assets/sounds/music_loop.mp3'
let musicPlay = false
function playMusic() {
    if (!musicPlay) {
        audio.play()
        audio.volume = 0.1
        audio.loop = true
        musicPlay = true
    } else {
        audio.pause()
        musicPlay = false
    }
}

document.querySelector('.music--control')?.addEventListener('click', () => {
    playMusic()
})

document.querySelector('.music--control--2')?.addEventListener('click', () => {
    playMusic()
})

function initWhatsAppForms(){
    const defaultNumber = '962797020156'
    const forms = document.querySelectorAll<HTMLFormElement>('.contact-form')
    forms.forEach(form => {
        const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]')
        phoneInput?.addEventListener('blur', () => {
            phoneInput.value = formatPhoneNumber(phoneInput.value)
        })

        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const formData = new FormData(form)
            const name = (formData.get('name') as string ?? '').trim()
            const phoneInputValue = (formData.get('phone') as string ?? '').trim()
            const normalizedPhone = formatPhoneNumber(phoneInputValue)
            phoneInput && (phoneInput.value = normalizedPhone)
            const message = (formData.get('message') as string ?? '').trim()
            const payload = [
                'Hello Perfect Solution, I have a furniture inquiry.',
                name ? `Name: ${name}` : '',
                normalizedPhone ? `Phone: ${normalizedPhone}` : '',
                message ? `Message: ${message}` : ''
            ].filter(Boolean).join('\n')
            const rawNumber = (form.dataset.whatsapp ?? defaultNumber).replace(/[^0-9]/g, '')
            const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(payload)}`
            window.open(whatsappUrl, '_blank')
        })
    })
}

setupViewer()
initWhatsAppForms()
initLanguageSwitch()
initShowroomGallery()

function setLanguage(lang: SupportedLang){
    currentLang = lang
    document.body.setAttribute('dir', 'ltr')
    document.body.dataset.lang = lang

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n
        if(!key) return
        const value = translations[lang]?.[key] ?? translations.en[key]
        if(value !== undefined){
            el.innerHTML = value
        }
    })

    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder
        if(!key) return
        const value = placeholderTranslations[lang]?.[key] ?? placeholderTranslations.en[key]
        if(value !== undefined){
            el.placeholder = value
        }
    })
}

function initLanguageSwitch(){
    const buttons = document.querySelectorAll<HTMLButtonElement>('.lang-switch button')
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = (button.dataset.lang as SupportedLang) ?? 'en'
            setLanguage(lang)
            buttons.forEach(btn => btn.classList.toggle('active', btn === button))
        })
    })
    setLanguage('en')
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === 'en'))
}

function initShowroomGallery(){
    const modal = document.querySelector('.showroom-modal') as HTMLElement | null
    if(!modal) return
    const triggers = document.querySelectorAll<HTMLElement>('[data-showroom-trigger], .showroom-trigger')
    const closeBtn = modal.querySelector('.showroom-close') as HTMLButtonElement | null
    const tabs = modal.querySelectorAll<HTMLButtonElement>('.showroom-tabs button')
    let currentCategory: 'chairs' | 'offices' | 'kitchens' = 'chairs'

    const setCategory = (category: 'chairs' | 'offices' | 'kitchens') => {
        currentCategory = category
        modal.dataset.category = category
        tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.category === category))
    }

    const openModal = () => {
        modal.classList.add('open')
        modal.setAttribute('aria-hidden', 'false')
        document.body.classList.add('modal-open')
        setCategory(currentCategory)
    }

    const closeModal = () => {
        modal.classList.remove('open')
        modal.setAttribute('aria-hidden', 'true')
        document.body.classList.remove('modal-open')
        lightbox?.classList.remove('open')
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            openModal()
        })
    })

    closeBtn?.addEventListener('click', closeModal)
    modal.addEventListener('click', (event) => {
        if(event.target === modal){
            closeModal()
        }
    })

    document.addEventListener('keydown', (event) => {
        if(event.key === 'Escape' && modal.classList.contains('open')){
            closeModal()
        }
    })

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = (tab.dataset.category as 'chairs' | 'offices' | 'kitchens') ?? 'chairs'
            setCategory(category)
        })
    })

    const lightbox = modal.querySelector('.showroom-lightbox') as HTMLElement | null
    const lightboxImg = lightbox?.querySelector('img') as HTMLImageElement | null
    const lightboxCaption = lightbox?.querySelector('p') as HTMLElement | null
    const lightboxClose = lightbox?.querySelector('.lightbox-close') as HTMLButtonElement | null

    const openLightbox = (src: string, alt: string, caption: string) => {
        if(!lightbox || !lightboxImg || !lightboxCaption) return
        lightboxImg.src = src
        lightboxImg.alt = alt
        lightboxCaption.innerHTML = caption
        lightbox.classList.add('open')
        lightbox.setAttribute('aria-hidden', 'false')
    }

    const closeLightbox = () => {
        if(!lightbox) return
        lightbox.classList.remove('open')
        lightbox.setAttribute('aria-hidden', 'true')
    }

    lightboxClose?.addEventListener('click', closeLightbox)
    lightbox?.addEventListener('click', (event) => {
        if(event.target === lightbox){
            closeLightbox()
        }
    })

    modal.querySelectorAll<HTMLElement>('.showroom-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img')
            const caption = item.querySelector('figcaption')
            if(img && caption){
                openLightbox(img.getAttribute('src') ?? '', img.getAttribute('alt') ?? '', caption.innerHTML)
            }
        })
    })

    setCategory('chairs')
}

function formatPhoneNumber(rawPhone: string){
    const digitsOnly = rawPhone.replace(/\D+/g, '')
    if(!digitsOnly){
        return ''
    }
    if(digitsOnly.startsWith('962')){
        return `+${digitsOnly}`
    }
    if(digitsOnly.startsWith('0')){
        return `+962${digitsOnly.substring(1)}`
    }
    if(digitsOnly.length <= 9){
        return `+962${digitsOnly}`
    }
    return `+${digitsOnly}`
}
