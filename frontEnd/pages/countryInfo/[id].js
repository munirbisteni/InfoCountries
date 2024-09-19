import Head from 'next/head';
import {useRouter, useROuter} from 'next/router';
import styles from '../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import 'chart.js/auto';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

export default function CountryInfo({ countryName,neighbours, population, flag}){
    const router = useRouter();
    const {id} = router.query;

    const data = {
      labels: population.map(p => p.year),
      datasets: [
        {
          label: 'Population',
          data: population.map(p => p.value),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
    
    const buttonBack = () => {
          router.push(`../`)
    }

    return (
        <div className={styles.container}>
          <Head>
            <title>InfoCountries</title>
            <link rel="icon" href={flag} />
          </Head>
    
          <main>
            <header>
              <h1 className={styles.title}>
                information about <b>{countryName}!</b> 
              </h1>{flag != undefined &&(

              <img src={flag} className='flag'></img>
            )}
            </header>
            <button onClick={buttonBack}>
            back to home
          </button>
            <div className='listing'>
            <div style={{ width: '100%', height: '100%' }}>
              <h2>Population through time</h2>
              <Line data={data} />
            </div>
            <ul><h2>Neighbours:</h2>  {
                neighbours.map((neighbour) =>(
                  <li ><a href={`/countryInfo/${neighbour[0]}`}>{neighbour[1]}</a></li>
                ))
              }</ul>
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
              height: 90%;
              width: 90%;
              flex-direction: column;
              align-itens: center;
              justify-contet: center;
              text-align: center;
            }
            header{
              display:flex;
              flex-direction: row;
              justify-content: center;
              align-itens; center;
              padding: 0.125em;
              }
            .flag{
              width: 4em;
              height: 4em;
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
              table {
              border-collapse: collapse;
              font-family: sans-serif;
              font-size: 0.8rem;
              letter-spacing: 1px;
              border-radius: 0.25rem;
            }
            caption {
              caption-side: bottom;
              padding: 10px;
              font-weight: bold;
            }
            ul{
             list-style-type:none;
            }
            thead,
            tfoot {
              background-color: rgb(228 240 245);
            }

            th,
            td {
              border: 1px solid rgb(160 160 160);
              padding: 8px 10px;
            }

            td:last-of-type {
              text-align: center;
            }

            tbody > tr:nth-of-type(even) {
              background-color: rgb(237 238 242);
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
    
    export async function getServerSideProps({ params }){
      const { id } = params;
      try{
        const resCountries = await fetch(`http://localhost:3000/countries/countryInfo/${id}`)
        const countries =  await resCountries.json();
        var countryName = countries.countryName;
        var neighbours = countries.neighbours;

        const resPopulation = await fetch(`http://localhost:3000/countries/countryInfo/population/${countries.countryName}`)
        const population =  await resPopulation.json();

        
        const resFlag = await fetch(`http://localhost:3000/countries/countryInfo/flag/${id}`)
        var flag = null;
        console.log(resFlag.status)
        if(resFlag.status !== 500){
          flag =  await resFlag.json();
        }
        
        return{
          props: {
            countryName,
            neighbours,
            population,
            flag
          },
        };
      }catch (error)
      {
        console.log("error to get countries: ", error);
        return{
          props: {
            countryName: "",
            neighbours: [],
            population: ["",""],
            flag: ""
          }
        }   
      }
    }