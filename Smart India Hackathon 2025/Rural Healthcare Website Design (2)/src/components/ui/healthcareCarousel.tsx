
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HealthcareCarousel = () => {
  const images = [
    {
      src:"src/components/images/image1.png",
      title: "Transforming Rural Healthcare",
      desc: "Connecting communities through technology"
    },
    {
      src: "src/components/images/hospital.png",
      title: "Telemedicine for Everyone",
      desc: "Affordable and accessible healthcare"
    },
    {
      src: "src/components/images/farmers.png",
      title: "Empowering Doctors & Patients",
      desc: "Seamless communication with technology"
    }
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      pagination={{ clickable: true }}
      className="rounded-xl shadow-lg"
    >
      {images.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="relative">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-lg mb-1">{item.title}</h4>
              <p className="text-sm opacity-90">{item.desc}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HealthcareCarousel;
