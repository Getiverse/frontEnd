import { Camera, CameraResultType, CameraSource, CameraOptions, ImageOptions } from "@capacitor/camera";

class CameraGallery {
    private base64Image = "";
    private options: ImageOptions;
    constructor() {
        Camera.requestPermissions({ permissions: ["photos"] })
        this.options = {
            source: CameraSource.Photos,
            resultType: CameraResultType.Uri
        }
    }

    public async pickImageFromGallery() {
        try {
            const result = await Camera.getPhoto(this.options);
            if (result.webPath) {
                //this.base64Image = result.base64String;
                return result.webPath;
            }
        } catch (e) {
            console.log(e);
        }
    }
    public getImage() {
        if (this.base64Image) {
            return this.base64Image
        }
        throw new Error("Image not found");
    }
}

export default CameraGallery;