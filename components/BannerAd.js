import Image from "react-bootstrap/Image";

function BannerAd(){
    return(
        <div className="banner-ad">
            <Image
            width={600}
            height={75}
            alt="banner advertisement"
            src="https://via.placeholder.com/600x75"
            />
        </div>
    );
}
export default BannerAd;