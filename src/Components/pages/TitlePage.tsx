import React, { useEffect, useRef, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import BGparticles from '../particles/particles'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'

let handleClick: (event: any) => void

let loginrotation = 0.2
let signuprotation = -0.2
let textMesh: any

const TitlePage: React.FC = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const textRefs = useRef<THREE.Mesh[]>([]) // Change to an array of refs
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentUser) navigate('/dashboard')

    // Create Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // Set alpha to true for transparent background

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0) // Set clear color to black with 0 opacity
    containerRef.current?.appendChild(renderer.domElement)

    // Create 3D Text
    const fontLoader = new FontLoader()
    fontLoader.load(
      '../../../public/Open Sans Extrabold_Regular.json',
      (font) => {
        const text = 'Catnip.Solutions'
        const letters = text.split('')
        let xOffset = -300 // Start from a position further to the left

        letters.forEach((letter, index) => {
          const geometry = new TextGeometry(letter, {
            font: font,
            size: 45,
            depth: 20,
            curveSegments: 20,
          })

          geometry.computeBoundingBox() // Compute the bounding box

          const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
          textMesh = new THREE.Mesh(geometry, material)
          textMesh.position.set(xOffset, 0, -500)
          textMesh.castShadow = true
          textMesh.receiveShadow = true
          textMesh.material.transparent = true
          textMesh.material.opacity = 0
          textRefs.current[index] = textMesh

          scene.add(textMesh)

          // Add a null check before accessing the bounding box
          if (geometry.boundingBox) {
            xOffset +=
              geometry.boundingBox.max.x - geometry.boundingBox.min.x + 10 // Add some spacing between letters
          }
        })

        // Add 3D buttons
        const buttonMaterial = new THREE.MeshStandardMaterial({
          color: 0x080c45,
        }) // Red color for buttons
        const buttonGeometry = new THREE.BoxGeometry(125, 50, 20) // Adjust size as needed

        // Login Button
        const loginButton = new THREE.Mesh(buttonGeometry, buttonMaterial)
        loginButton.position.set(-75, -80, -480) // Position underneath the text
        loginButton.rotation.z = loginrotation // Rotate the button
        loginButton.castShadow = true // Enable shadows
        scene.add(loginButton)

        // Signup Button
        const signupButton = new THREE.Mesh(buttonGeometry, buttonMaterial)
        signupButton.position.set(65, -80, -480) // Position underneath the text
        signupButton.rotation.z = signuprotation // Rotate the button
        signupButton.castShadow = true // Enable shadows
        scene.add(signupButton)

        // Create text geometry and material for login button
        const loginTextGeometry = new TextGeometry('Login', {
          font: font,
          size: 20,
          depth: 5,
        })
        const loginTextMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        })
        const loginTextMesh = new THREE.Mesh(
          loginTextGeometry,
          loginTextMaterial
        )
        loginTextMesh.rotation.z = loginrotation
        loginTextMesh.position.set(-115, -96, -470) // Adjust position to be above the login button
        scene.add(loginTextMesh)

        // Create text geometry and material for signup button
        const signupTextGeometry = new TextGeometry('Signup', {
          font: font,
          size: 20,
          depth: 5,
        })
        const signupTextMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        })
        const signupTextMesh = new THREE.Mesh(
          signupTextGeometry,
          signupTextMaterial
        )
        signupTextMesh.position.set(16, -80, -470) // Adjust position to be above the signup button
        signupTextMesh.rotation.z = signuprotation
        scene.add(signupTextMesh)

        // Raycaster for mouse click detection
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        // Handle mouse click
        handleClick = (event: MouseEvent) => {
          event.preventDefault()
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

          // Create a new Vector2 instance with adjusted coordinates
          const raycasterOrigin = new THREE.Vector2(mouse.x, mouse.y - 0.1)

          raycaster.setFromCamera(raycasterOrigin, camera)

          // Fine-tune raycaster parameters
          raycaster.near = camera.near
          raycaster.far = camera.far

          // Increase the button hit area with a bounding box
          const intersects = raycaster.intersectObjects(
            [loginButton, signupButton],
            true
          )

          if (intersects.length > 0) {
            const intersectedButton = intersects[0].object
            if (intersectedButton === loginButton) {
              navigate('/login')
            } else if (intersectedButton === signupButton) {
              navigate('/signup')
            }
          }
        }

        // Add event listener for mouse click
        renderer.domElement.addEventListener('click', handleClick)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2) // Reduce ambient light intensity for better contrast
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8) // Increase light intensity
        directionalLight.position.set(-1, 1, 1) // Set light direction from top-left
        directionalLight.castShadow = true // Enable shadow casting
        directionalLight.shadow.mapSize.width = 2048 // Increase shadow map size for heavier shadows
        directionalLight.shadow.mapSize.height = 2048
        scene.add(directionalLight)

        // Render loop
        const animate = () => {
          requestAnimationFrame(animate)
          renderer.render(scene, camera)
        }

        animate()

        // Create a new box geometry and material
        const boxGeometry = new THREE.BoxGeometry(600, 100, 20) // Adjust size as needed
        const boxMaterial = new THREE.MeshStandardMaterial({
          color: 0x080c45,
        }) // Red color for box

        // Create a new mesh using the box geometry and material
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
        boxMesh.position.set(0, 25, -510) // Position behind the text
        boxMesh.castShadow = true // Enable shadows
        scene.add(boxMesh)

        const adjustObjectScale = (
          object:
            | THREE.Mesh<
                THREE.BoxGeometry,
                THREE.MeshStandardMaterial,
                THREE.Object3DEventMap
              >
            | THREE.Mesh<
                TextGeometry,
                THREE.MeshBasicMaterial,
                THREE.Object3DEventMap
              >,
          scaleFactor = 1
        ) => {
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          // Adjust the scale based on the viewport resolution
          if (viewportWidth < 600 || viewportHeight < 600) {
            // If the viewport width or height is less than 600px, make the object half its original size
            object.scale.set(
              0.5 * scaleFactor,
              0.5 * scaleFactor,
              0.5 * scaleFactor
            )
          } else {
            // If the viewport width and height are 600px or larger, keep the object at its original size
            object.scale.set(1 * scaleFactor, 1 * scaleFactor, 1 * scaleFactor)
          }
        }

        // Create a GSAP timeline
        const tl = gsap.timeline()

        // Create separate timelines for each animation
        const tlLoginRotation = gsap.timeline()
        const tlLoginPosition = gsap.timeline()
        const tlSignupRotation = gsap.timeline()
        const tlSignupPosition = gsap.timeline()

        // Add an animation to the timeline for the login button and login text rotation
        tlLoginRotation.to([loginButton.rotation, loginTextMesh.rotation], {
          z: -0.2, // Rotate to -0.2
          duration: 1,
          yoyo: true, // Reverse the animation on each alternate cycle
          repeat: -1, // Repeat the animation indefinitely
          ease: 'power1.inOut', // Add easing for a smoother transition
        })

        // Add an animation to the timeline for the login text position
        tlLoginPosition.to(loginTextMesh.position, {
          y: '+=10', // Increase y position by 8
          duration: 1,
          yoyo: true, // Reverse the animation on each alternate cycle
          repeat: -1, // Repeat the animation indefinitely
          ease: 'power1.inOut', // Add easing for a smoother transition
        })

        // Add an animation to the timeline for the signup button and signup text rotation
        tlSignupRotation.to([signupButton.rotation, signupTextMesh.rotation], {
          z: 0.2, // Rotate to 0.2
          duration: 1,
          yoyo: true, // Reverse the animation on each alternate cycle
          repeat: -1, // Repeat the animation indefinitely
          ease: 'power1.inOut', // Add easing for a smoother transition
        })

        // Add an animation to the timeline for the signup text position
        tlSignupPosition.to(signupTextMesh.position, {
          y: '-=10', // Decrease y position by 8
          duration: 1,
          yoyo: true, // Reverse the animation on each alternate cycle
          repeat: -1, // Repeat the animation indefinitely
          ease: 'power1.inOut', // Add easing for a smoother transition
        })

        // Start all animations at the same time
        tlLoginRotation.play()
        tlLoginPosition.play()
        tlSignupRotation.play()
        tlSignupPosition.play()

        // Add an animation to the timeline
        textRefs.current.forEach((textMesh, index) => {
          tl.to(textMesh.material, {
            opacity: 1, // Fade in
            duration: 0.15, // Increase duration for a smoother transition
            delay: index * 0.005,
            ease: 'power2.out', // Add easing for a smoother transition
          })
        })

        // Add an animation to the timeline for the box
        tl.to(boxMesh.scale, {
          opacity: 1, // Fade in
          x: 1.2, // Scale up
          y: 1.2,
          z: 1.2,
          ease: 'power2.out', // Add easing for a smoother transition
        })

        // Adjust the scale of the buttons and text
        adjustObjectScale(loginButton)
        adjustObjectScale(signupButton)
        adjustObjectScale(loginTextMesh)
        adjustObjectScale(signupTextMesh)
        adjustObjectScale(boxMesh, 0.833) // 1 / 1.2 = 0.833

        // Call the adjustObjectScale function whenever the window size changes
        window.addEventListener('resize', () => {
          adjustObjectScale(loginButton)
          adjustObjectScale(signupButton)
          adjustObjectScale(loginTextMesh)
          adjustObjectScale(signupTextMesh)
          adjustObjectScale(boxMesh, 0.833) // 1 / 1.2 = 0.833
        })
      }
    )

    // Camera position
    camera.position.set(0, 0, 0) // Set camera position to the center

    // Disable camera controls rotation
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableRotate = false

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', handleClick)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="">
      <BGparticles />
      <div
        ref={containerRef}
        className="text-white min-h-full h-screen flex flex-col relative items-center justify-center pb-20"
      ></div>
    </div>
  )
}

export default TitlePage
