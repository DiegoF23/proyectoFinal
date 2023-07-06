import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from "notistack";

const sucessClick = (dato) => {
    if(dato==1){
        enqueueSnackbar("se Registro el Turno ! 😉📋", {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "left",
            },
        })
    } else if (dato==2){
        enqueueSnackbar("Guardamos la Modificacion del turno ! 👌📝", {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "left",
            },
        })
    } else {
        enqueueSnackbar("Se Cancelo el Turno ! 📋🗑", {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "left",
            },
        })
    }
    };
    const ErrorClick = () => {
        enqueueSnackbar("Algo salio mal !!! 🤖", {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
        })
    }


const MainTurnos = () => {
    const [datos,setDatos]=useState(null)
    const [id,setId]=useState(0)
    const [idPac,setIdPac]=useState(0)
    const [dniCliente,setDniCliente]=useState(0)
    const [observaciones,setObservaciones]=useState("")
    const [fecha,setFecha]=useState("")
    const [idVet,setIdVet]=useState(0)
    const [tipo,setTipo]=useState("")
    const [botones,setBotones]=useState(false)
    const navigate= useNavigate()
    const mostrarTurnos=async ()=>{
        try{
            const response = await axios.get("http://localhost:3000/turnos")
            const dataArray =response.data
            setDatos(dataArray)
        } catch(error) {
            console.log(error)
        }
    }

    const agregarTurno = async()=>{
        try{
            const response= await axios.post("http://localhost:3000/turnos",{
                idPac,
                dniCliente,
                observaciones,
                fecha,
                idVet,
                tipo
            })
            if(response.status===200){
                sucessClick(1)
                mostrarTurnos()
                localStorage.removeItem("idPaciente")
                localStorage.removeItem("dniDueño")
            }else{
                ErrorClick()
            }
        }catch(error){
            console.error("Error al consultar con el servidor"+error)
            ErrorClick()
        }
    }

    const edicion=(turno)=>{
        localStorage.removeItem("idPaciente")
        localStorage.removeItem("dniDueño")
        setIdPac(turno.idPac)
        setDniCliente(turno.dniCliente)
        setObservaciones(turno.observaciones)
        setFecha(turno.fecha)
        setIdVet(turno.idVet)
        setTipo(turno.tipo)
        setId(turno.id)
        setBotones(true)
    }
    const modificarTurno=async()=>{
        try{
            const response=await axios.put("http://localhost:3000/turnos",{
                idPac,
                dniCliente,
                observaciones,
                fecha,
                idVet,
                tipo,
                id
            })
            if(response.status===200){
                sucessClick(2)
                mostrarTurnos()
            }
            else{
                ErrorClick()
            }
        }catch(error){
            console.error("Error al consultar con el servidor"+error)
            ErrorClick()
        }
    }

    const cancelarTurno = (turno)=>{
        axios.delete(`http://localhost:3000/turnos/delete/`+turno.id)
        .then((response)=>{
            if(response.status===200){
                sucessClick(3)
                mostrarTurnos()
            }else{
                ErrorClick()
            }
        })
        .catch((error)=>{
           console.error("error al cancelar el turno", error)
           ErrorClick() 
        })
    }
    const limpiar=()=>{
        setIdPac(0)
        setDniCliente(0)
        setObservaciones("")
        setFecha("")
        setIdVet(0)
        setTipo("")
        setId(0)
        setBotones(false)
        localStorage.removeItem("idPaciente")
        localStorage.removeItem("dniDueño")
    }


    useEffect(()=>{
        if(datos!==null){
            console.log(datos)
            const storedIdPac = localStorage.getItem('idPaciente');
            const storedDniCliente = localStorage.getItem('dniDueño');
            if (storedIdPac && storedDniCliente) {
              setIdPac(storedIdPac);
              setDniCliente(storedDniCliente);
            }
        }else{
            mostrarTurnos()
        }
    },[datos])




  return (
   <> 
   <form action="">
    <label htmlFor="">Ingrese el id del paciente</label>
    <input type="number" value={idPac} onChange={(e)=>setIdPac(e.target.value)} />
    <br />
    <label htmlFor="">Ingrese el DNI del dueño</label>
    <input type="number" value={dniCliente} onChange={(e)=>setDniCliente(e.target.value)} />
    <br />
    <label htmlFor="">Ingrese las observaciones indicadas</label>
    <input type="text" value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} />
    <br />
    <label htmlFor="">La fecha del turno asignado</label>
    <input type="datetime-local" value={fecha} onChange={(e)=>setFecha(e.target.value)} />
    <br />
    <label htmlFor="">Ingrese el id del Veterinario que atendera a la mascota</label>
    <input type="number" value={idVet} onChange={(e)=>setIdVet(e.target.value)} />
    <br />
    <label htmlFor="">Ingrese el motivo de la consulta</label>
    <input type="text" value={tipo} onChange={(e)=>setTipo(e.target.value)} />
    <br />
    <button type="button" onClick={agregarTurno} disabled={botones}>Agregue el nuevo turno</button>
    <button type='button' onClick={modificarTurno} disabled={!botones}>Agregar cambios al turno</button>
    <button type='button' onClick={limpiar}>Cancelar</button>

   </form>
   <br />
   <br />
   <br />
   <br />
   {datos!==null?(
    <table>
        <thead>
            <tr>
                <th>IdPaciente</th>
                <th>DNI del dueño</th>
                <th>Observaciones</th>
                <th>Fecha</th>
                <th>Id Veterinario</th>
                <th>Motivo</th>
            </tr>
        </thead>
        <tbody>
            {datos.map((obj) => (
                <tr key={obj.id}>
                <td>{obj.idPac}</td>
                <td>{obj.dniCliente}</td>
                <td>{obj.observaciones}</td>
                <td>{obj.fecha}</td>
                <td>{obj.idVet}</td>
                <td>{obj.tipo}</td>
                <td><button onClick={()=>cancelarTurno(obj)}>Cancelar Turno</button></td>
                <td><button onClick={()=>edicion(obj)}>Modificar Turno</button></td>
                </tr>
            ))}
        </tbody>
    </table>
   ):(
    <p>No hay datos para mostrar</p>
   )}

   <br />
   <br /><br />
   <button onClick={()=>navigate('/Home')}>Volver a Home</button>
   
   </>
  )
}

export default MainTurnos