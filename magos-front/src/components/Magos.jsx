import { createContext, useContext, useEffect, useRef, useState } from "react"
import './Magos.css'
import { getImagen } from '../data/magos'

const MagosContext = createContext()

export const Magos = () => {

    const { VITE_EXPRESS } = import.meta.env

    const [ magos, setMagos ] = useState([])

    const formularioPost = useRef(null)

    let getMagos = async () => {
        console.log(`Obteniendo magos`)

        let options = {
            method: `get`
        }
        let peticion = await fetch(`${VITE_EXPRESS}/magos`, options)
        let { data } = await peticion.json()
        setMagos(data)
    }

    let deleteMago = async (idParam) => {
        console.log(`Eliminando al mago ${idParam}`)

        let options = {
            method: `delete`
        }
        const peticion = await fetch(`${VITE_EXPRESS}/magos/${idParam}`, options)
        const { data } = await peticion.json()
        setMagos(data)
    }

    let putMago = async (idParam, datos) => {
        console.log(`Actualizando al mago ${idParam}`)

        let options = {
            method: `put`,
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(datos)
        }
        let peticion = await fetch(`${VITE_EXPRESS}/magos/${idParam}`, options)
        let { data } = await peticion.json()
        setMagos(data)
    }

    let postMago = async ( e ) => {
        e.preventDefault()
        console.log(`Añadiendo mago`)

        const { nombre, edad, casa, vivo } = formularioPost.current
        const nuevo = {
            nombre: nombre.value,
            edad: edad.value,
            casa: casa.value,
            vivo: vivo.value === `true`
        }

        let options = {
            method: `post`,
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(nuevo)
        }
        const peticion = await fetch(`${VITE_EXPRESS}/magos`, options)
        const { data } = await peticion.json()
        setMagos(data)

        formularioPost.current.reset()
    }

    useEffect( () => {
        getMagos()
    }, [])

    return (

        <MagosContext.Provider value={{ putMago, deleteMago }}>
        <section className="Magos">

            <header className="Magos-header">
                <h1 className="Magos-title">Gestión de Magos</h1>
            </header>

            <div className="Magos-forms">
                <div className="Magos-formulario">
                    <h3 className="Magos-h3">Añadir mago</h3>
                    <form className="Magos-form" onSubmit={postMago} ref={formularioPost}>
                        <input type="text"   name="nombre" placeholder="Nombre" className="Magos-input" required/>
                        <input type="number" name="edad"   placeholder="Edad"   className="Magos-input" required min="0" max="200"/>
                        <select name="casa" className="Magos-input" defaultValue="Gryffindor" required>
                            <option value="Gryffindor">Gryffindor</option>
                            <option value="Slytherin">Slytherin</option>
                            <option value="Hufflepuff">Hufflepuff</option>
                            <option value="Ravenclaw">Ravenclaw</option>
                        </select>
                        <select name="vivo" className="Magos-input" defaultValue="true" required>
                            <option value="true">Vivo</option>
                            <option value="false">Muerto</option>
                        </select>
                        <input type="submit" value="Añadir mago" className="Magos-send"/>
                    </form>
                </div>
            </div>

            { magos?.length === 0 && <p className="Magos-empty">No hay magos</p> }

            <div className="Magos-grid">
                { magos?.map( mago =>
                    <Tarjeta key={mago._id} {...mago} />
                )}
            </div>

        </section>
        </MagosContext.Provider>

    )
}


const Tarjeta = ( props ) => {

    const { putMago, deleteMago } = useContext(MagosContext)

    const { _id, nombre, casa, edad, vivo } = props
    const [ turned, setTurned ] = useState(false)
    const [ modoEdit, setModoEdit ] = useState(false)

    const formularioPut = useRef(null)

    const turn = () => {
        if (modoEdit) return
        console.log(`Girar tarjeta de ${nombre}`)
        setTurned(!turned)
    }

    const empezarEdit = ( e ) => {
        e.stopPropagation()
        console.log(`Actualizando al mago ${_id}`)
        setModoEdit(true)
    }

    const cancelarEdit = (e) => {
        e.stopPropagation()
        setModoEdit(false)
    }

    const submitEdit = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(`Guardando cambios del mago ${_id}`)

        const { nombre, edad, casa, vivo } = formularioPut.current
        const datos = {
            nombre: nombre.value,
            edad: edad.value,
            casa: casa.value,
            vivo: vivo.value === `true`
        }

        putMago(_id, datos)
        setModoEdit(false)
    }

    return (
        <article
            className={`Tarjeta Tarjeta--${casa.toLowerCase()} ${ turned ? `flipped` : `` }`}
            onClick={turn}>

            <div className="Tarjeta-front">
                <img className="Tarjeta-img" src={getImagen(nombre)} alt={nombre} />
                <h3 className="Tarjeta-h3">{nombre}</h3>
            </div>

            <div
                className={`Tarjeta-back ${ modoEdit ? `Tarjeta-back--edit` : `` }`}
                onClick={ modoEdit ? ( e ) => e.stopPropagation() : undefined }>

                { !modoEdit && (
                    <>
                        <h3 className="Tarjeta-h3 Tarjeta-h3--back">{nombre}</h3>
                        <p className="Tarjeta-p">
                            <span className="Tarjeta-pLabel">Casa:</span> {casa}
                        </p>
                        <p className="Tarjeta-p">
                            <span className="Tarjeta-pLabel">Edad:</span> {edad}
                        </p>
                        <p className="Tarjeta-p">
                            <span className="Tarjeta-pLabel">Estado:</span> { vivo ? `Vivo` : `Muerto` }
                        </p>
                        <div className="Tarjeta-actions">
                            <button className="Magos-send Magos-send--mini" onClick={empezarEdit}>Actualizar</button>
                            <button className="Magos-send Magos-send--mini Magos-send--red" onClick={(e) => { e.stopPropagation(); deleteMago(_id) }}>Eliminar</button>
                        </div>
                    </>
                )}

                { modoEdit && (
                    <form className="Tarjeta-form" onSubmit={submitEdit} ref={formularioPut}>
                        <input type="hidden" name="_id" defaultValue={_id}/>
                        <input type="text"   name="nombre" placeholder="Nombre" className="Magos-input" defaultValue={nombre} required/>
                        <input type="number" name="edad"   placeholder="Edad"   className="Magos-input" defaultValue={edad}   required min="0" max="200"/>
                        <select name="casa" className="Magos-input" defaultValue={casa}>
                            <option value="Gryffindor">Gryffindor</option>
                            <option value="Slytherin">Slytherin</option>
                            <option value="Hufflepuff">Hufflepuff</option>
                            <option value="Ravenclaw">Ravenclaw</option>
                        </select>
                        <select name="vivo" className="Magos-input" defaultValue={String(vivo)}>
                            <option value="true">Vivo</option>
                            <option value="false">Muerto</option>
                        </select>
                        <div className="Tarjeta-actions">
                            <input type="submit" value="Guardar" className="Magos-send Magos-send--mini"/>
                            <button type="button" className="Magos-send Magos-send--mini Magos-send--secundario" onClick={cancelarEdit}>Cancelar</button>
                        </div>
                    </form>
                )}

            </div>

        </article>
    )
}
