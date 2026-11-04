import {
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
  FaChartBar,
} from "react-icons/fa";

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/arshisaleh/",
    icon: FaLinkedinIn,
  },
  {
    name: "Tableau",
    url: "https://public.tableau.com/app/profile/arshisaleh/vizzes",
    icon: FaChartBar,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/arshisaleh/?hl=en",
    icon: FaInstagram,
  },
  {
    name: "Twitter",
    url: "https://x.com/SalehArshi",
    icon: FaTwitter,
  },
];

export default function Footer({ dataSourceName, dataSourceUrl }) {
  return (
    <footer style={{ width: "100%", padding: "0 32px" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: 0,
          }}
        >
          Design created by{" "}
          <span style={{ fontWeight: 600, color: "#374151" }}>Arshi Saleh</span>
        </p>

        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            margin: "5px 0 0 0",
          }}
        >
          Energy data source:{" "}
          <a href={dataSourceUrl} target="_blank" rel="noopener noreferrer">
            {dataSourceName}
          </a>
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "28px",
            marginTop: "30px",
          }}
        >
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                style={{ color: "#6b7280" }}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
