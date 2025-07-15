import React from "react";
import { Card } from "primereact/card";
import { FaLinkedin } from "react-icons/fa";
import footerImage from "../assets/images/nusealab.png";
import header from "../assets/images/nusealab2.png";

const teamMembers = [
  {
    name: "Kush Sharma",
    role: "Backend Team Lead",
    degree: "Masters of Data Science | Deakin University",
    linkedin: "https://www.linkedin.com/in/kush-sharmaa/",
  },
  {
    name: "Joe Cin NG",
    role: "Frontend Team Lead",
    degree: "Master of IT | Deakin University",
    linkedin: "https://www.linkedin.com/in/joe-cin-ng-457a61243",
  },
  {
    name: "Raveel Kashif",
    role: "Senior Team Lead Frontend",
    degree: "Masters in Information Technology | Deakin University ",
    linkedin: "https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav",
  },
  {
    name: "Maddy Lewis",
    role: "Frontend Team Member",
    degree: "Bachelor of Information Technology | Deakin University",
    linkedin: "https://www.linkedin.com/in/madeline-lewis-b93a68234",
  },
  {
    name: "Imesha Ilangasinghe",
    role: "Frontend Team Member",
    degree: "Master of IT | Deakin University",
    linkedin: "https://au.linkedin.com/in/imesha-i",
  },
  {
    name: "Bryan Mwenda Nkonge",
    role: "Backend Developer",
    degree: "Master of Cybersecurity | Deakin University",
    linkedin: "https://www.linkedin.com/in/bryan-nkonge-79189489?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    name: "Muhammad Junaid Hashmi",
    role: "Backend Developer",
    degree: "Master of Science in Information Technology | Deakin University",
    linkedin: "http://linkedin.com/in/junaid-hashmi-a8335620a",
  },
  {
    name: "Anmolpreet Singh",
    role: "Backend Developer",
    degree: "Bachelor of Information Technology | Deakin University",
    linkedin: "http://linkedin.com/in/anmolpreet-singh-ab7648229",
  },
  {
    name: "Aung Phone Myint",
    role: "Frontend Team Member",
    degree: "Bachelors of Cybersecurity | Deakin University",
    linkedin: "https://www.linkedin.com/in/aung-phone-myint-a5375b129/",
  },
  {
    name: "Tharusha Dilina Gunasekara Wawul Penage",
    role: "Backend Team Member",
    degree: "Masters of Data Science | Deakin University",
    linkedin: "https://www.linkedin.com/in/tharusha-gunasekara-0ba3a9160/",
  },
  {
    name: "Anshpreet Singh",
    role: "Frontend Team Member",
    degree: "Bachelors of Software Engineering | Deakin University",
    linkedin: "https://www.linkedin.com/in/anshpreet-kathpal-93ab84297?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    name: "Mercy Jebet",
    role: "Frontend Team Member",
    degree: "Master of Cybersecurity | Deakin University",
    linkedin: "https://www.linkedin.com/in/mercy-jebet-24303a2b4/"
  },
];

const AboutPage = () => {
  return (
    <div className="p-4 max-w-screen-xl to mx-auto space-y-2">
        
      {/* About Us Card */}
      <Card className="rounded-2xl text-center py-1 px-3">
        <div
          style={{
            background: "linear-gradient(to bottom right,#a3e2c7, #cef6e5)",
            borderRadius: "20px",
          }}
          className="p-3 w-full"
        >
          <div className="flex items-center justify-center">
            <img
              src={header}
              alt="NuSeaLab Logo"
              className="w-1 h-1 object-center mx-auto "
            />
          </div>
          <h2 className="text-neutral-900 mt-0 text-6xl font-medium mb-4">
            About Us
          </h2>
          <p className="text-neutral-900 text-lg mx-auto">
            The Nutrition and Seafood Laboratory (NuSea.Lab) is a
            multidisciplinary research team hosted within the School of Life and
            Environmental Sciences at Deakin University.
            <br />
            <br />
            We focus our research effort on the direction of nutrition-based
            sciences, specifically towards supporting the seafood and
            aquaculture sectors with significant collaborative research programs
            both nationally and internationally. For more information, visit:
            <a href="https://lab.org.au/" className="text-blue-200 underline">
              https://lab.org.au/
            </a>
          </p>
        </div>
      </Card>

      {/* Credits Section */}
      <Card className="rounded-2xl p-3">
        <h2 className="text-center text-6xl font-medium mb-6">Credits</h2>
        <div className="flex flex-wrap gap-3">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="rounded-xl text-center flex flex-col justify-between p-4 ml-7"
              title={member.name}
              subTitle={member.role}
              style={{
                background: "linear-gradient(to bottom right,#a3e2c7, #cef6e5)",
                borderRadius: "20px",
                height: "15rem",
                width: "100%",
                display: 'flex',
                justifyContent: 'center',
                maxWidth: window.innerWidth >= 800 ? "450px" : "100%",
              }}
            >
              <p className="text-sm text-gray-700 mb-3">{member.degree}</p>
              <a href={member.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin size={22} />
              </a>
            </Card>
          ))}
        </div>
      </Card>

      {/* Footer Card */}
      <Card className="p-4">
        <div className="w-full rounded-lg overflow-hidden">
          <img
            src={footerImage}
            alt="NuSeaLab Footer"
            className="h-96 w-full object-cover object-center"
          />
        </div>
      </Card>

      {/* Footer Part */}
      {/* <div className="text-center text-xl text-black py-3 font-medium">
        © 2025 Deakin University
      </div> */}
    </div>
  );
};

export default AboutPage;
