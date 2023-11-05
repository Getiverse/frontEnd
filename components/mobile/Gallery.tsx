import { BiImage } from "react-icons/bi";
import { SetterOrUpdater } from "recoil";
import CameraGallery from "../../utils/classes/CameraGallery";
import Text from "../Text";

function Gallery({ setImage }: { setImage: SetterOrUpdater<string> }) {
  const gallery = new CameraGallery();

  function handleClick() {
    /**@ts-ignore */
    gallery.pickImageFromGallery().then((value) => {
      value && setImage(value);
    });
  }
  return (
    <button
      className="flex items-center space-x-4"
      onClick={() => handleClick()}
    >
      <div className="bg-gray-200 p-2 rounded-full text-gray-500">
        <BiImage color="#6b7280" size="30" />
      </div>
      <Text size="text-lg">Upload from gallery</Text>
    </button>
  );
}
export default Gallery;
