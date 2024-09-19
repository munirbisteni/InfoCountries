import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home({countries}) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const  router = useRouter();
  
  const handlerCountryInfo = () => {
    if (selectedCountry) {
        router.push(`/countryInfo/${selectedCountry}`)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>InfoCountries</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Welcome to <b>InfoCountries!</b>
        </h1>

        <div className='listing'>
          <p>
            <select
              value = {selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
             >
              <option value =""> Select a country to start!</option>
              {
                countries.map((country) =>(
                  <option key= {country.countryCode} value = {country.countryCode}>{country.name}</option>
                ))
              }
            </select>
          </p>
          {selectedCountry && (
            <p>Selected Country: {countries.find((country) => country.countryCode === selectedCountry)?.name}</p>
          )}
          <button onClick={handlerCountryInfo} disabled={!selectedCountry}>
            See country information
          </button>
        </div>
      </main>

      <footer>
        <a>
         Created by Munir Bisteni
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
        .listing {
          display: flex;
          flex-direction: column;
          align-itens: center;
          justify-contet: center;
          text-align: center;
          padding: 0.15rem;
        }

        select{
          width: 100%;
          font-size: 1.15rem;
          padding: 0.675em 6em 0.675em 1em;
          background-color: #fff;
          border: 1px solid #caced1;
          border-radius: 0.25rem;
          color: #000;
          cursor: pointer;
          }
        button{
          text-align:center;
          width: 100%;
          font-size: 1.15rem;
          padding: 0.675em 1em 0.675em 1em;
          background-color: #000;
          border: 1px solid #caced1;
          border-radius: 0.25rem;
          color: #fff;
          cursor: pointer;
          text-align: center;
          }
        button:disabled{
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(){
  try{
    const res = await fetch('http://localhost:3000/countries/')
    const countries =  await res.json();
    return{
      props: {
        countries,
      },
    };
  }catch (error)
  {
    console.log("error to get countries: ", error);
    return{
      props: {
        countries: [],
      }
    }   
  }
}