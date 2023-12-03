import axios from "axios";
import { useQuery, gql } from "@apollo/client";
import "./styles/CountryList.css";
import { useEffect, useState } from "react";

const GET_COUNTRIES = gql`
  query {
    countries {
      name
      capital
      languages {
        name
      }
      continent {
        name
      }
      states {
        name
      }
      currency
    }
  }
`;

const CountryList = () => {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [searchCountry, setSearchCountry] = useState("");
  const [countryImages, setCountryImages] = useState({});
  const [continents, setContinents] = useState(false);
  const [selectedContinents, setSelectedContinents] = useState([]);
  const [countryDetails, setCountryDetails] = useState({});
  const [nodal, setNodal] = useState(false);

  const continentsData = [
    { name: "Europa", image: "europa.jpg", apiName: "Europe" },
    { name: "Norte America", image: "america.jpg", apiName: "North America" },
    { name: "Sur America", image: "surAmerica.jpg", apiName: "South America" },
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
      if (continentApiName === "America") {
        const continentesAmerica = ["South America", "North America"];
        setSelectedContinents([...selectedContinents, ...continentesAmerica]);
      } else {
        setSelectedContinents([...selectedContinents, continentApiName]);
      }
    }
  };

  const handleOpenCountryDetails = (countrySelect) => {
    const continent = countrySelect.currentTarget.dataset.continent;
    const currency = countrySelect.currentTarget.dataset.currency;
    const capital = countrySelect.currentTarget.dataset.capital;

    const statesString = countrySelect.currentTarget.dataset.states;
    const statesArray = JSON.parse(statesString);

    const languagesString = countrySelect.currentTarget.dataset.languages;
    const languagesArray = JSON.parse(languagesString);

    const image = countrySelect.currentTarget.dataset.image;

    const details = {
      name: countrySelect.target.id,
      continent: continent,
      currency: currency,
      capital: capital,
      states: statesArray,
      languages: languagesArray[0].name,
      image: image,
    };

    setNodal(true);
    setCountryDetails(details);
  };
  console.log(countryDetails.states);

  const handleCloseCountryDetails = () => {
    setNodal(!nodal);
  };

  const handleInputClick = () => {
    setContinents(true);
  };

  const handleBtnContinent = () => {
    setContinents(false);
  };

  const filterCountries = data?.countries?.filter((country) => {
    const matchesName = country.name
      .toLowerCase()
      .includes(searchCountry.toLowerCase());

    const matchesContinent =
      selectedContinents.length === 0 ||
      selectedContinents.includes(country.continent.name);

    return matchesName && matchesContinent;
  });

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
          <p>País</p>
          <input
            type="text"
            id="paisSearch"
            onChange={handleSearch}
            value={searchCountry}
            placeholder="Buscar país..."
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
        <div className="btnSearch">
          <i className="bx bx-search-alt-2 iconSearch"></i>
          <button className="btnSearch">Buscar</button>
        </div>
      </form>

      <article
        className={
          nodal ? "countryDetails countryDetails__onn" : "countryDetails"
        }
      >
        <button
          onClick={handleCloseCountryDetails}
          className="countryDetails__close"
        >
          X
        </button>
        <div>
          <img src={countryDetails.image} alt="" />
          <div className="countryDetails__title">
            Bandera
            <div>
              <h4>{countryDetails.name}</h4>
              <p>{countryDetails.continent}</p>
            </div>
          </div>
          <h4>
            Capital:{" "}
            <span className="countryDetails__span">
              {countryDetails.capital}
            </span>
          </h4>
          <h4>
            Language:{" "}
            <span className="countryDetails__span">
              {countryDetails.languages}
            </span>
          </h4>
          <h4>
            Currency:{" "}
            <span className="countryDetails__span">
              {countryDetails.currency}
            </span>
          </h4>
          <h4>Population:</h4>
          <ul className="statesNodal">
            Region:{" "}
            {countryDetails.states ? (
              countryDetails.states.map((state) => (
                <span key={state.name} className="countryDetails__span__nodal">
                  {state.name},{" "}
                </span>
              ))
            ) : (
              <span>No hay datos de regiones disponibles.</span>
            )}
          </ul>
        </div>
      </article>
      {loading ? (
        <h1>Cargando...</h1>
      ) : (
        <section className="countries">
          <ul className="countriesList">
            {filterCountries?.map((country) => (
              <li
                key={country.name}
                id={country.name}
                style={{
                  backgroundImage: `url(${countryImages[country.name]})`,
                }}
                className="country"
                onClick={handleOpenCountryDetails}
                data-continent={country.continent.name}
                data-capital={country.capital}
                data-languages={JSON.stringify(country.languages)}
                data-currency={country.currency}
                data-states={JSON.stringify(country.states)}
                data-image={countryImages[country.name]}
              >
                <div className="title">
                  <div>BANDERA</div>
                  <div>
                    <h4>{country.name}</h4>
                    <p>{country.continent.name}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default CountryList;
