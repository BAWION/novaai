import * as THREE from 'three';

export interface KnowledgeNode {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'asteroid';
  color: string;
  size: number;
  position: [number, number, number];
  orbitRadius?: number;
  orbitSpeed?: number;
  parentId?: string;
  children?: string[];
  level?: number;
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
  courseId?: number;
  description?: string;
  domains?: string[];
  tags?: string[];
}

export class GalaxyScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private nodes: Map<string, THREE.Object3D>;
  private knowledgeNodesData: Map<string, KnowledgeNode>;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private controls: any;
  private animations: any[];
  private currentFocus: string | null = null;
  private clickCallback: ((nodeId: string) => void) | null = null;
  private hoverCallback: ((nodeId: string | null) => void) | null = null;
  private clock: THREE.Clock;
  
  constructor(container: HTMLElement) {
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000817);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      60, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      2000
    );
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    
    // Setup the rest of the scene elements
    this.setupLights();
    this.setupStars();
    
    // Initialize data structures
    this.nodes = new Map();
    this.knowledgeNodesData = new Map();
    this.animations = [];
    
    // Setup interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Clock for animations
    this.clock = new THREE.Clock();
    
    // Bind events
    window.addEventListener('resize', this.onWindowResize.bind(this));
    container.addEventListener('mousemove', this.onMouseMove.bind(this));
    container.addEventListener('click', this.onClick.bind(this));
    
    // Start animation loop
    this.animate();
  }
  
  private setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    this.scene.add(ambientLight);
    
    // Directional light (sun-like)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(50, 50, 50);
    this.scene.add(mainLight);
    
    // Add a central glow for the galaxy center
    const pointLight = new THREE.PointLight(0x3355ff, 3, 100);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);
  }
  
  private setupStars() {
    // Create a star field background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(stars);
  }
  
  public setKnowledgeNodes(nodes: KnowledgeNode[]) {
    // Clear existing nodes
    this.nodes.forEach(node => this.scene.remove(node));
    this.nodes.clear();
    this.knowledgeNodesData.clear();
    
    // Add new nodes
    nodes.forEach(nodeData => {
      const obj = this.createNodeObject(nodeData);
      this.scene.add(obj);
      this.nodes.set(nodeData.id, obj);
      this.knowledgeNodesData.set(nodeData.id, nodeData);
      
      // Setup orbits
      if (nodeData.parentId && nodeData.orbitRadius) {
        this.setupOrbit(nodeData);
      }
    });
  }
  
  private createNodeObject(node: KnowledgeNode): THREE.Object3D {
    const group = new THREE.Group();
    group.userData = { id: node.id };
    
    // Different geometry based on node type
    let geometry: THREE.BufferGeometry;
    switch (node.type) {
      case 'star':
        geometry = new THREE.SphereGeometry(node.size, 32, 32);
        break;
      case 'planet':
        geometry = new THREE.SphereGeometry(node.size, 24, 24);
        break;
      case 'moon':
        geometry = new THREE.SphereGeometry(node.size, 16, 16);
        break;
      case 'asteroid':
        geometry = new THREE.DodecahedronGeometry(node.size, 0);
        break;
      default:
        geometry = new THREE.SphereGeometry(node.size, 24, 24);
    }
    
    // Material based on node status
    let material: THREE.Material;
    let emissive = 0x000000;
    
    if (node.status === 'completed') {
      emissive = 0x333333;
    } else if (node.status === 'in-progress') {
      emissive = 0x222255;
    }
    
    material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(node.color),
      emissive: new THREE.Color(emissive),
      roughness: 0.7,
      metalness: 0.3
    });
    
    if (node.status === 'locked') {
      (material as THREE.MeshStandardMaterial).opacity = 0.3;
      (material as THREE.MeshStandardMaterial).transparent = true;
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add glow effect for important nodes
    if (node.type === 'star' || node.status === 'in-progress') {
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(node.color) },
          viewVector: { value: new THREE.Vector3() }
        },
        vertexShader: `
          uniform vec3 viewVector;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            intensity = pow(0.7 - dot(vNormal, normalize(viewVector)), 4.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 1.0);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      
      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(node.size * 1.2, 32, 32),
        glowMaterial
      );
      
      group.add(glowMesh);
    }
    
    // Add label if it's an important node
    if (node.type === 'star' || node.type === 'planet') {
      // In a real implementation, we would add a sprite with text
      // For simplicity, we're skipping the actual text rendering here
    }
    
    group.add(mesh);
    group.position.set(node.position[0], node.position[1], node.position[2]);
    
    return group;
  }
  
  private setupOrbit(node: KnowledgeNode) {
    if (!node.orbitRadius) return;
    
    // Create orbit visualization
    const curve = new THREE.EllipseCurve(
      0, 0,                         // center x, y
      node.orbitRadius, node.orbitRadius, // xRadius, yRadius
      0, 2 * Math.PI,               // startAngle, endAngle
      false,                        // clockwise
      0                             // rotation
    );
    
    const points = curve.getPoints(128);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p: { x: number, y: number }) => new THREE.Vector3(p.x, 0, p.y))
    );
    
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x444466,
      transparent: true,
      opacity: 0.3
    });
    
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    
    // Get parent node
    const parentNode = this.nodes.get(node.parentId!);
    if (parentNode) {
      orbit.position.copy(parentNode.position);
      this.scene.add(orbit);
      
      // Add animation
      this.animations.push({
        update: (delta: number) => {
          if (!node.orbitSpeed) return;
          
          const nodeObj = this.nodes.get(node.id);
          if (!nodeObj) return;
          
          const angle = this.clock.getElapsedTime() * node.orbitSpeed;
          
          // Calculate new position based on orbit
          const x = parentNode.position.x + Math.cos(angle) * node.orbitRadius!;
          const z = parentNode.position.z + Math.sin(angle) * node.orbitRadius!;
          
          nodeObj.position.x = x;
          nodeObj.position.z = z;
        }
      });
    }
  }
  
  public zoomToNode(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    
    this.currentFocus = nodeId;
    
    // Animate camera to focus on this node
    const targetPosition = new THREE.Vector3().copy(node.position);
    targetPosition.y += 10; // Look slightly from above
    
    // In a real implementation, we would use a tweening library
    // For simplicity, we're just setting the camera position
    this.camera.position.set(
      targetPosition.x + 30,
      targetPosition.y + 30,
      targetPosition.z + 30
    );
    this.camera.lookAt(targetPosition);
  }
  
  public resetView() {
    this.currentFocus = null;
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);
  }
  
  public setClickCallback(callback: (nodeId: string) => void) {
    this.clickCallback = callback;
  }
  
  public setHoverCallback(callback: (nodeId: string | null) => void) {
    this.hoverCallback = callback;
  }
  
  private onWindowResize() {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
  
  private onMouseMove(event: MouseEvent) {
    const container = this.renderer.domElement;
    const rect = container.getBoundingClientRect();
    
    this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    
    this.checkIntersections();
  }
  
  private onClick(event: MouseEvent) {
    // We're already tracking mouse position in onMouseMove
    this.checkIntersections(true);
  }
  
  private checkIntersections(isClick = false) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
    let hoveredNode: string | null = null;
    
    for (const intersect of intersects) {
      // Find the node this object belongs to
      let obj = intersect.object;
      while (obj && !obj.userData?.id) {
        obj = obj.parent as THREE.Object3D;
      }
      
      if (obj && obj.userData?.id) {
        hoveredNode = obj.userData.id;
        
        if (isClick && this.clickCallback) {
          this.clickCallback(hoveredNode as string);
        }
        
        break;
      }
    }
    
    if (this.hoverCallback) {
      this.hoverCallback(hoveredNode);
    }
  }
  
  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // Update animations
    this.animations.forEach(animation => animation.update(delta));
    
    // Update shader uniforms for glow effects
    this.scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh && 
          object.material instanceof THREE.ShaderMaterial && 
          object.material.uniforms.viewVector) {
        object.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
          this.camera.position,
          object.position
        );
      }
    });
    
    this.renderer.render(this.scene, this.camera);
  }
  
  public dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.removeEventListener('click', this.onClick.bind(this));
    
    // Dispose geometries and materials
    this.scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        
        if (Array.isArray(object.material)) {
          object.material.forEach((material: THREE.Material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
  }
}