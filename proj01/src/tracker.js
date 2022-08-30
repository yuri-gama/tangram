import { pointInMesh } from './polygon.js'

export class Tracker {
    constructor(meshes, camera) {
        this.meshes = meshes
        this.camera = camera
        this.currentMesh = null
        this.enabled = false
        this.worldMousePos = null
    }

    enable(mousePos) {
        this.enabled = true
        this.worldMousePos = this.projectIntoWorld(mousePos)

        for (let mesh of this.meshes) {
            if (pointInMesh(mousePos, mesh, this.camera)) {
                this.currentMesh = mesh
            }
        }
    }

    disable() {
        this.enabled = false
        this.currentMesh = null
    }

    track(mousePos) {
        if (!this.enabled || !this.worldMousePos || !this.currentMesh) {
            return
        }

        let worldMousePos = this.projectIntoWorld(mousePos)
        this.currentMesh.position.x = worldMousePos[0] - this.worldMousePos[0]
        this.currentMesh.position.y = worldMousePos[1] - this.worldMousePos[1]
    }

    projectIntoWorld(pos) {
        let pointingRay = new THREE.Vector3(
            2*pos[0]/window.innerWidth - 1,
            -2*pos[1]/window.innerHeight + 1,
            this.camera.position.z,
        ).unproject(this.camera).sub(this.camera.position).normalize()
        pointingRay.multiplyScalar(-this.camera.position.z/pointingRay.z)
        let worldPos = new THREE.Vector3().copy(this.camera.position).add(pointingRay)
        return [worldPos.x, worldPos.y]
    }
}