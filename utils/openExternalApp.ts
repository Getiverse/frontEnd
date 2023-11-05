import { AppLauncher } from "@capacitor/app-launcher";
import { Device } from "@capacitor/device";

const checkCanOpenUrl = async (url: string) => {
    const { value } = await AppLauncher.canOpenUrl({ url });

    return value;
};

const openUrl = async (url: string) => {
    await AppLauncher.openUrl({ url });
};

export async function openApp(url: string, webUrl: string) {
    if ((await Device.getInfo()).platform == "web") {
        window.open(webUrl, '_blank');
    }
    else {
        const canBeOppended = await checkCanOpenUrl(url);
        if (canBeOppended) {
            openUrl(url)
        }
    }
}