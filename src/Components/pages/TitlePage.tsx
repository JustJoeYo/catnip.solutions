import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import BGparticles from '../particles/particles'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { isMobile } from 'react-device-detect'
import { gsap } from 'gsap'

// Set camera distance based on device type
let getCameraDistance = () => (isMobile ? 100 : 60)

export const TitlePage = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let clickOccurred = false

  useEffect(() => {
    if (currentUser) navigate('/dashboard')

    let signUpTextMesh: THREE.Mesh | null = null
    let logInTextMesh: THREE.Mesh | null = null
    let navigationOccurred = false
    let text: THREE.Mesh | null = null
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      getCameraDistance(),
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 50)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    document.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      clickOccurred = true
    })

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement)
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableRotate = false
    controls.enableZoom = false
    controls.enablePan = false

    renderer.domElement.style.touchAction = 'none'

    // Enable shadows in the renderer
    renderer.shadowMap.enabled = true

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x060342, 10)
    scene.add(ambientLight)

    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 2)
    dirLight.position.set(0, 20, 10)
    dirLight.castShadow = true // default false
    scene.add(dirLight)

    const loader = new FontLoader()
    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json',
      function (font) {
        const geometry = new TextGeometry('Catnip.Solutions', {
          font: font,
          size: 10,
          depth: 3,
        })

        const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
        text = new THREE.Mesh(geometry, material)
        text.castShadow = true
        text.receiveShadow = false
        geometry.center() // Center the geometry
        text.position.z = -50 // Move the text back
        text.scale.set(0.5, 0.5, 0.5) // Scale down the text
        text.rotation.x = -Math.PI / 9 // Rotate 45 degrees around x-axis
        text.rotation.y = Math.PI / 8 // Rotate 45 degrees around y-axis

        // Add the text to the scene
        scene.add(text)

        // Create the animation
        gsap.fromTo(
          text.rotation,
          { y: -0.1 }, // start from -0.25 radian
          {
            y: 0.5, // rotate to 0.25 radian
            repeat: -1, // repeat indefinitely
            yoyo: true, // reverse the animation on each alternate repeat
            ease: 'power1.inOut', // smooth start/end
            duration: 3.25, // duration of one cycle
          }
        )

        // Add box behind "Catnip.Solutions"
        const boxGeometry = new THREE.BoxGeometry(100, 20, 10) // Adjust size as needed
        const boxMaterial = new THREE.MeshStandardMaterial({
          color: 0x0000ff,
          transparent: false,
          opacity: 0.5,
        })
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
        boxMesh.castShadow = true
        boxMesh.receiveShadow = true
        boxMesh.position.z = -75 // Position box behind text
        boxMesh.rotation.x = -Math.PI / 9 // Rotate 45 degrees around x-axis
        boxMesh.rotation.y = Math.PI / 8 // Rotate 45 degrees around y-axis
        scene.add(boxMesh)

        // Create the animation for the box
        gsap.fromTo(
          boxMesh.rotation,
          { y: -0.1 }, // start from -0.25 radian
          {
            y: 0.5, // rotate to 0.25 radian
            repeat: -1, // repeat indefinitely
            yoyo: true, // reverse the animation on each alternate repeat
            ease: 'power1.inOut', // smooth start/end
            duration: 3.25, // duration of one cycle
          }
        )

        // Inside font loader callback
        const createButton = (textStr: string, position: THREE.Vector3) => {
          const geometry = new TextGeometry(textStr, {
            font: font,
            size: 5,
            depth: 5,
          })
          const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
          const textMesh = new THREE.Mesh(geometry, material)
          geometry.center()
          textMesh.castShadow = true
          textMesh.receiveShadow = false
          textMesh.position.copy(position)
          textMesh.rotation.x = -Math.PI / 9
          textMesh.rotation.y = Math.PI / 8

          if (textStr === 'Sign Up') {
            signUpTextMesh = textMesh
          } else if (textStr === 'Log In') {
            logInTextMesh = textMesh
          }

          // Create the animation
          gsap.fromTo(
            textMesh.rotation,
            { y: -0.1 }, // start from -0.25 radian
            {
              y: 0.5, // rotate to 0.25 radian
              repeat: -1, // repeat indefinitely
              yoyo: true, // reverse the animation on each alternate repeat
              ease: 'power1.inOut', // smooth start/end
              duration: 3.25, // duration of one cycle
            }
          )

          const boxGeometry = new THREE.BoxGeometry(35, 10, 5)
          const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            transparent: false,
            opacity: 0.5,
          })
          const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
          boxMesh.castShadow = true
          boxMesh.receiveShadow = true
          boxMesh.position.x = boxMesh.position.copy(position).x
          boxMesh.position.y = boxMesh.position.copy(position).y
          boxMesh.position.z = -51.5
          boxMesh.rotation.x = -Math.PI / 9
          boxMesh.rotation.y = Math.PI / 8

          // Create the animation for the box
          gsap.fromTo(
            boxMesh.rotation,
            { y: -0.1 }, // start from -0.25 radian
            {
              y: 0.5, // rotate to 0.25 radian
              repeat: -1, // repeat indefinitely
              yoyo: true, // reverse the animation on each alternate repeat
              ease: 'power1.inOut', // smooth start/end
              duration: 3.25, // duration of one cycle
            }
          )

          // Inside createButton function
          document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children)

            for (let i = 0; i < intersects.length; i++) {
              if (
                intersects[i].object === textMesh ||
                intersects[i].object === boxMesh
              ) {
                gsap.to(textMesh.scale, {
                  x: 1.1,
                  y: 1.1,
                  z: 1.1,
                  duration: 0.5,
                })
                gsap.to(boxMesh.scale, {
                  x: 1.1,
                  y: 1.1,
                  z: 1.1,
                  duration: 0.5,
                })
              } else {
                gsap.to(textMesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 })
                gsap.to(boxMesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 })
              }
            }
          })

          document.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children)

            for (let i = 0; i < intersects.length; i++) {
              if (
                intersects[i].object === textMesh ||
                intersects[i].object === boxMesh
              ) {
                gsap.to(textMesh.scale, {
                  x: 0.9,
                  y: 0.9,
                  z: 0.9,
                  duration: 0.5,
                })
                gsap.to(boxMesh.scale, {
                  x: 0.9,
                  y: 0.9,
                  z: 0.9,
                  duration: 0.5,
                })
              } else {
                gsap.to(textMesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 })
                gsap.to(boxMesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 })
              }
            }
          })

          document.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children)

            for (let i = 0; i < intersects.length; i++) {
              if (
                intersects[i].object === textMesh ||
                intersects[i].object === boxMesh
              ) {
                gsap.to(textMesh.scale, {
                  x: 0.9,
                  y: 0.9,
                  z: 0.9,
                  duration: 0.5,
                })
                gsap.to(boxMesh.scale, {
                  x: 0.9,
                  y: 0.9,
                  z: 0.9,
                  duration: 0.5,
                })

                // Add fade-out animation
                gsap.to(scene.children, {
                  opacity: 0,
                  duration: 0.75,
                  onComplete: () => {
                    // Redirect to the next page
                    if (
                      textStr === 'Sign Up' ||
                      intersects[i].object === signUpTextMesh
                    ) {
                      window.location.href = 'signup'
                    } else if (
                      textStr === 'Log In' ||
                      intersects[i].object === logInTextMesh
                    ) {
                      window.location.href = 'login'
                    }
                  },
                })
              } else {
                gsap.to(textMesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 })
                gsap.to(boxMesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 })
              }
            }
          })

          scene.add(textMesh)
          scene.add(boxMesh)
        }

        createButton('Sign Up', new THREE.Vector3(-25, -25, -50))
        createButton('Log In', new THREE.Vector3(25, -25, -50))
      },
      undefined, // onProgress callback, not needed here
      function (error) {
        console.error('An error occurred while loading the font:', error)
      }
    )

    const animate = function () {
      requestAnimationFrame(animate)

      /*if (clickOccurred && !navigationOccurred) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(scene.children)

        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object === signUpTextMesh) {
            navigationOccurred = true
            //navigate('/signup')
          } else if (intersects[i].object === logInTextMesh) {
            navigationOccurred = true
            //navigate('/login')
          }
        }

        clickOccurred = false
      }*/

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      // Update camera
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (containerRef.current) {
        window.removeEventListener('resize', handleResize)
        renderer.domElement.style.touchAction = 'auto'
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [currentUser, navigate])

  return (
    <div className="">
      <BGparticles />
      <div ref={containerRef} className="text-white absolute zindex-1"></div>
    </div>
  )
}
