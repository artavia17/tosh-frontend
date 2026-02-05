import AwardsScooter from '../assets/img/png/scooter.png';
import ImaginaImage from '../assets/img/png/imagina.png';

const Awards = () => {

    return (
        <>
            <main className='top-space awards-page'>
                <div className="responsive-box">
                    <section>
                        <img src={ImaginaImage} alt="Mochilas de la colección Tosh & Lo bueno de cuidarte" className='imagina'/>
                        <p>
                            Con la <strong>Xiaomi Electric Scooter 4 Lite</strong> podés moverte con ligereza, seguridad y estilo. Su motor ágil y batería duradera de hasta 25 km te permiten llegar a donde quieras sin estrés, mientras cuidás tu tiempo y disfrutás tu camino. Sus frenos duales E‑ABS + tambor te dan mayor seguridad en cada recorrido. Es más que una patineta: es tu compañera para sumar bienestar, movimiento y libertad a tu día a día.
                        </p>
                        <img src={AwardsScooter} alt="Mochilas de la colección Tosh & Lo bueno de cuidarte" />
                    </section>
                    {/* <section className='reclamar'>
                        <h1>¿CÓMO RECLAMAR TUS PREMIOS?</h1>
                        <ol>
                            <li><p>Tené a la mano el empaque ganador.</p></li>
                            <li><p>Prepará una fotocopia de tu documento de identidad.</p></li>
                            <li><p>Descargá, imprimí y <a href="/pdf/carta.pdf" target="_blank">llená este formulario</a>.</p></li>
                            <li><p>Presentate con estos documentos en la dirección indicada.</p></li>
                        </ol>
                    </section> */}
                </div>
            </main>
        </>
    )

}

export default Awards