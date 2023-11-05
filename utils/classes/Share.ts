import { Device } from '@capacitor/device';
import { Share } from '@capacitor/share';
import { ModalType } from '../../components/types/Modal';

class ShareLink {
    private title: string;
    private text: string;
    private url: string;
    private dialogTitle: string;
    constructor(title: string, text: string, url: string, dialogTitle: string) {
        this.title = title;
        this.text = text;
        this.url = url;
        this.dialogTitle = dialogTitle;
    }

    public async share(callback: () => void) {
        const platform = await (await Device.getInfo()).platform;
        if (platform != "web") {
            await Share.share({
                title: this.title,
                text: this.text,
                url: this.url,
                dialogTitle: this.dialogTitle,
            });
        }
        else {
            callback();
        }
    }

}

export default ShareLink;



