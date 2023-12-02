import axios from "axios";
import { useQuery, gql } from "@apollo/client";
import "./styles/CountryList.css";
import { useEffect, useState } from "react";

const GET_COUNTRIES = gql`
  query {
    countries {
      name
      capital
      continent {
        name
      }
    }
  }
`;

const CountryList = () => {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [searchCountry, setSearchCountry] = useState("");
  const [countryImages, setCountryImages] = useState({});
  const [continents, setContinents] = useState(false);
  const [selectedContinents, setSelectedContinents] = useState([]);

  const continentsData = [
    { name: "Europa", image: "europa.jpg", apiName: "Europe" },
    { name: "America", image: "america.jpg", apiName: "America" },
    { name: "Asia", image: "asia.jpg", apiName: "Asia" },
    { name: "Oceania", image: "oceania.jpg", apiName: "Oceania" },
    { name: "Africa", image: "africa.jpg", apiName: "Africa" },
  ];

  const handleSearch = (e) => {
    setSearchCountry(e.target.value);
  };

  const handleContinentChange = (continentApiName) => {
    if (selectedContinents.includes(continentApiName)) {
      setSelectedContinents(
        selectedContinents.filter((continent) => continent !== continentApiName)
      );
    } else {
      setSelectedContinents([...selectedContinents, continentApiName]);
    }
  };

  const handleInputClick = () => {
    setContinents(true);
  };

  const handleBtnContinent = () => {
    setContinents(false);
  };

  const filterCountries = data?.countries?.filter((country) => {
    // Filtrar por nombre del país
    const matchesName = country.name
      .toLowerCase()
      .includes(searchCountry.toLowerCase());

    // Filtrar por continente seleccionado (si hay continentes seleccionados)
    const matchesContinent =
      selectedContinents.length === 0 ||
      selectedContinents.includes(country.continent.name);

    return matchesName && matchesContinent;
  });

  const getFormattedContinentName = (nameContinent) => {
    // Lógica para formatear el nombre del continente
    if (nameContinent.includes('America')) return 'America';
    
    return nameContinent;
  };

  useEffect(() => {
    const KEY = "41000778-1453bd970fbac54f9157b298c";

    const fetchImages = async () => {
      const images = {};

      for (const country of data.countries) {
        try {
          const response = await axios.get(
            `https://pixabay.com/api/?key=${KEY}&q=${country.capital}&image_type=photo`
          );
          const imagesData = response.data;
          const image = imagesData?.hits?.[0]?.webformatURL;

          if (image) {
            images[country.name] = image;
          }
        } catch (error) {
          console.error(`No se pudo encontrar la imagen deseada`, error);
        }
      }

      setCountryImages(images);
    };

    if (data && data.countries) {
      fetchImages();
    }
  }, [data]);

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className="search">
        <div>
          <p>Pais</p>
          <input
            type="text"
            id="paisSearch"
            onChange={handleSearch}
            value={searchCountry}
            placeholder="Buscar pais..."
            autoComplete="off"
            onClick={handleInputClick}
          />
        </div>
        <section className={continents ? "continents block" : "continents"}>
          <button className="btnFilter" onClick={handleBtnContinent}>
            x
          </button>
          <ul>
            {continentsData.map((continent) => (
              <li
                key={continent.apiName}
                onClick={() => handleContinentChange(continent.apiName)}
                className={
                  selectedContinents.includes(continent.apiName)
                    ? "selected"
                    : "notSelected"
                }
              >
                <div>
                  <img
                    src={`./${continent.image}`}
                    alt={`Bandera de ${continent.name}`}
                  />
                </div>
                {continent.name}
              </li>
            ))}
          </ul>
        </section>
        <button className="btnSearch">Buscar</button>
      </form>
      <section className="countries">
        {loading ? (
          <h2>Cargando datos</h2>
        ) : (
          <ul className="countriesList">
            {filterCountries?.map((country) => (
              <li
                key={country.name}
                style={{
                  backgroundImage: `url(${countryImages[country.name]})`,
                }}
                className="country"
              >
                <div className="title">
                  <div>BANDERA</div>
                  <div>
                    <h4>{country.name}</h4>
                    <p>{getFormattedContinentName(country.continent.name)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default CountryList;
