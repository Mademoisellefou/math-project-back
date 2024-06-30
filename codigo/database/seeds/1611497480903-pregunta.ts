
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'
import { Pregunta } from 'src/application/pregunta/entity'
import { Respuesta } from 'src/application/respuesta/entity'

export class pregunta1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      //Leccion 1
      { idLeccion: 1, texto: "El 20% de los estudiantes de una escuela son varones, ¿qué porcentaje son mujeres?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio1" },//1
      { idLeccion: 1, texto: "Si un artículo cuesta 50Bs y aumenta su precio en un 25%, ¿cuál será el nuevo precio?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio2" },//2
      { idLeccion: 1, texto: "Si un descuento del 15% en una compra equivale a 30Bs, ¿cuál es el precio original del artículo?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio3" },//3
      { idLeccion: 1, texto: "https://proyectos-lib.casillero.laotrared.net/p-p-00.png", esImagen: true, apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio4" },//4
      { idLeccion: 1, texto: "Si el 60% de los empleados en una empresa son menores de 35 años, ¿qué porcentaje son mayores de 35 años?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio5" },//4
      { idLeccion: 1, texto: "Si el 25% de un número es 30, ¿cuál es el número?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio6" },//5
      { idLeccion: 1, texto: "Si un artículo se vende con un descuento del 10% y su precio de venta es de 80Bs, ¿cuál es el costo original del artículo?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio7" },//6
      { idLeccion: 1, texto: "https://proyectos-lib.casillero.laotrared.net/p-p-01.png", esImagen: true, apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio8" },//7
      { idLeccion: 1, texto: "Si un estudiante responde correctamente el 80% de las preguntas de un examen que tiene 50 preguntas en total, ¿cuántas preguntas respondió correctamente?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio9" },
      { idLeccion: 1, texto: "Si el precio del pasaje se aumenta en un 10% y ahora cuesta 10Bs, ¿cuál sera su precio original?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio10" },
      { idLeccion: 1, texto: "Si un empleado gana un aumento del 8% y ahora gana 2,160Bs mensuales, ¿cuál era su salario anterior?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio11" },
      { idLeccion: 1, texto: "Si el 40% de los residentes en una ciudad son propietarios de viviendas, ¿qué porcentaje son inquilinos?", apoyo: "https://matetutor.hacklab.org.bo/#/ejercicios/porcentajes/ejercicio12" },
      //Leccion 2
      { idLeccion: 2, texto: "¿Qué es la cultura tributaria?\nLa cultura tributaria son los conocimientos, ideas y comportamientos que tiene una sociedad sobre el pago de impuestos.", apoyo: "Cultura tributa­ria entendemos el conjunto de conocimientos, percepciones, actitudes y practicas de conducta de una sociedad a la tibutación." },
      { idLeccion: 2, texto: "¿Qué es tributar?\nTributar es pagar los impuestos que debemos al gobierno de nuestro país.", apoyo: "Es como una especie de acuerdo financiero que todos tenemos con el gobierno." },
      { idLeccion: 2, texto: "¿Qué es un tributo?\nUn tributo es el pago que hacemos al gobierno por vivir en una sociedad y disfrutar de sus beneficios.", apoyo: "El tributo es un ingreso publico proveniente de un pago obligatorio establecido por una autoridad publica y ley se asocie con la obligación de contribuir." },
      { idLeccion: 2, texto: "¿Qué tipos de tributos hay?\nLos principales tributos son los impuestos, las tasas y las contribuciones especiales. Las tasas son pagos por usar servicios públicos.", apoyo: "La mayoría de sistemas fiscales reconocen al menos tres tipos de tributos: el imuesto, la tasa y la contribución especial." },
      { idLeccion: 2, texto: "¿Qué es un impuesto?\nUn impuesto es un dinero que pagamos al gobierno para que pueda hacer cosas buenas para todos.", apoyo: "El impuesto es una clas de tributo regido por derecho público." },
      { idLeccion: 2, texto: "¿Por qué tenemos que pagar impuestos?\n1. Es una obligación que tenemos que cumplir porque así lo dice la ley. 2. Es una forma de ayudar a nuestro país y a las personas que viven en él.", apoyo: "El pago de impuestos representa el costo que ada quien debe asumir, según su capacidad, para convivir en una sociedad civilizada." },
      { idLeccion: 2, texto: "¿Para qué sirven los impuestos?\nLos impuestos sirven para que el gobierno pueda construir carreteras, tener policías que nos cuiden, tener escuelas y hospitales, y hacer muchas cosas más que nos benefician a todos.", apoyo: "Los impuestos son cargas obligatorias que las persona y empresas deben pagar para financiar la educación, la salud, la defensa, la seguridad, la justicia y la construc­ción de obras publicas, entre otras." },
      { idLeccion: 2, texto: "¿Puede el gobierno conseguir dinero de otras formas además de los impuestos?", apoyo: "Financia­miento  como el endeudamiento publico interno o externo cualquier clase de deuda que contraiga debera pagarla a futuro aumentada con las intereses." },
      { idLeccion: 2, texto: "¿Todas las personas tienen que pagar impuestos?", apoyo: "Según las leyes tributarias, todos debemos pagr impuestos, al menos en teoría." },
      { idLeccion: 2, texto: "¿Hay algunas personas que no tienen que pagar impuestos?", apoyo: "No existen excepciones" },
      { idLeccion: 2, texto: "Los tributos son", apoyo: "Los tributos son ingresos dederecho público" },
      { idLeccion: 2, texto: "Los tributos se utilizan para", apoyo: "Los tributos se utilizan para ctividades del Estado" },
      { idLeccion: 2, texto: "Los elementos del diseño del sistema tributario Boliviano son", apoyo: "Los elementos del diseño del sistema tributari Boliviano son 6" },
      { idLeccion: 2, texto: "El sujeto activo (el que paga) es un elemento del sistema", apoyo: "Los sujetos se  dividen en 2 pasivo y activo." },
      { idLeccion: 2, texto: "El sujeto pasivo (el que cobra) es un elemento del sistema", apoyo: "El pasivo es el contribyente que debe cumplir las obligaciones tributarias." },
      { esImagen: true, idLeccion: 2, texto: "https://proyectos-lib.casillero.laotrared.net/p-tri-00.png", apoyo: "Quienes no pagan impuestos." },
      { idLeccion: 2, texto: "¿Los niños están incluidos en el Regimen General?", apoyo: "Los niños no pagan impuestos." },
      { idLeccion: 2, texto: "¿Quiénes NO están incluidas en el Régimen General?", apoyo: "Personas que realizan actividades económicas." },
      { idLeccion: 2, texto: "¿En cuáles clasificaciones se dividen los contribuyentes dentro del Régimen General?", apoyo: "El mantenimiento de valor e intereses incrementan i pagas con demora tus impuestos." },
      { esImagen: true, idLeccion: 2, texto: "https://proyectos-lib.casillero.laotrared.net/p-tri-01.png", apoyo: "El ejemplo es correcto" },
      { idLeccion: 2, texto: "El pasivo es la persona que debe pagar el impuesto", apoyo: "El pasivo es el contribuyente quien está obligado al pago del tributo." },
      { idLeccion: 2, texto: "¿Cómo se clasifican los tributos?", apoyo: "Clasificacion de los tributos son 4." },
      { idLeccion: 2, texto: "¿Cuáles son todos los impuestos que hay en Bolivia?", apoyo: "Los impuestos que hay en Bolivia Impuesto,Tasas,Contribuciones Especiales y Patentes." },
      { idLeccion: 2, texto: "¿La Ley 843 de Reforma Tributaria abarca todos los tributos?", apoyo: "Ley 843 de Reforma Tributaria abarca los tributos" },
      { idLeccion: 2, texto: "¿La alícuota es el porcentaje que debe pagarse?", apoyo: "La alícuota se refiere al porcentaje que se aplica sobre una base imponible para calcular el monto a pagar" },
      { idLeccion: 2, texto: "Cobrar y no pagar impuestos es delito de fraude.", apoyo: "Cobrar en negro (sin tributar los impuestos) es también defraudar a la hacienda pública" },
      { idLeccion: 2, texto: "Crédito fiscal y débito fiscal son iguales", apoyo: "Crédito fiscal y débito fiscal son iguales." },
      { idLeccion: 2, texto: "El crédito fiscal es el impuesto que una empresa ya pagó en sus compras para su negocio, y que debe reponerse.", apoyo: "El crédito fiscal se refiere al impuesto que una empresa ya pagó en sus compras o adquisiciones de bienes y servicios para su negocio." },
      { idLeccion: 2, texto: "El débito fiscal es el impuesto que una empresa debe pagar al estado.", apoyo: "El débito fiscal se refiere al impuesto que una empresa debe pagar al estado por sus ventas o actividades gravadas." },
      //Leccion 3
      { idLeccion: 3, texto: "¿Los Restaurantes no están en el régimen general?" },
      { idLeccion: 3, texto: "¿En el Régimen General están personas naturales y jurídicas que desarrollan una actividad económica?" },
      { idLeccion: 3, texto: "¿Son solo 2 tipos de regimen en Bolivia?" },
      { idLeccion: 3, texto: "https://proyectos-lib.casillero.laotrared.net/p-ti-00.png", esImagen: true },
      { idLeccion: 3, texto: "¿El IVA debe estar en todas las Fases de producción o venta?" },
      { idLeccion: 3, texto: "¿La venta regular de bienes muebles deben pagar el IVA del 13%?" },
      { idLeccion: 3, texto: "¿El alquiler de bienes debe pagar el IVA del 13%?" },
      { idLeccion: 3, texto: "https://proyectos-lib.casillero.laotrared.net/p-ti-01.png", esImagen: true },
      { idLeccion: 3, texto: "¿Existen Operaciones con 0% de impuesto?" },
      { idLeccion: 3, texto: "¿La venta de Libros no conlleva impuestos?" },
      { idLeccion: 3, texto: "¿En Bolivia quiénes están exentos del IVA?" },
      { idLeccion: 3, texto: "https://proyectos-lib.casillero.laotrared.net/p-ti-02.png", esImagen: true },
      ///
      { idLeccion: 3, texto: "Supongamos que una empresa vendió productos por un valor de $100 con una alícuota del 13%. Cálculo del Impuesto a Pagar (Débito Fiscal):\nDébito Fiscal = 100 * 0.13 es:" },
      { idLeccion: 3, texto: "Supongamos que una empresa vendió productos por un valor de $120 con una alícuota del 13%. Cálculo del Impuesto a Pagar (Débito Fiscal):\nDébito Fiscal = 120 * 0.13 es:" },
      { idLeccion: 3, texto: "Supongamos que una empresa vendió productos por un valor de $150 con una alícuota del 13%. Cálculo del Impuesto a Pagar (Débito Fiscal):\nDébito Fiscal = 150 * 0.13 es: " },
      { idLeccion: 3, texto: "Supongamos que una empresa vendió productos por un valor de $200 con una alícuota del 13%. Cálculo del Impuesto a Pagar (Débito Fiscal):\nDébito Fiscal = 200 * 0.13 es:" },
      { idLeccion: 3, texto: "Para determinar si hay un saldo a favor o en contra, restamos el crédito fiscal del débito fiscal: Débito Fiscal  = 20, Crédito Fiscal = 10:\nEl Saldo Fiscal es ..." },
      { idLeccion: 3, texto: "Para determinar si hay un saldo a favor o en contra, restamos el crédito fiscal del débito fiscal: Débito Fiscal  = 30, Crédito Fiscal = 12:\nEl Saldo Fiscal es ..." },
      { idLeccion: 3, texto: "Para determinar si hay un saldo a favor o en contra, restamos el crédito fiscal del débito fiscal: Débito Fiscal  = 55, Crédito Fiscal = 34:\nEl Saldo Fiscal es ..." },
      { idLeccion: 3, texto: "Para determinar si hay un saldo a favor o en contra, restamos el crédito fiscal del débito fiscal: Débito Fiscal  = 70, Crédito Fiscal = 12:\nEl Saldo Fiscal es ..." },
      { idLeccion: 3, texto: "Para determinar si hay un saldo a favor o en contra, restamos el crédito fiscal del débito fiscal: Débito Fiscal  = 45, Crédito Fiscal = 23:\nEl Saldo Fiscal es ..." }
    ]

    const preguntasEtapa1 = items.map((item) => {
      return new Pregunta({
        idLeccion: item.idLeccion?.toString(),
        texto: item.texto,
        estado: 'ACTIVO',
        apoyo: item?.apoyo ?? '',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
        esImagen: item?.esImagen ? true : false,
      })
    })
    const nuevasPreguntasEtapa1 = await queryRunner.manager.save(preguntasEtapa1)
    const respuestasEtapa1 = [
      { esCorrecta: true, texto: "80%" },//1
      { esCorrecta: false, texto: "90%" },

      { esCorrecta: true, texto: "62.5Bs" },//2
      { esCorrecta: false, texto: "87.5Bs" },

      { esCorrecta: true, texto: "200Bs" },//3
      { esCorrecta: false, texto: "100Bs" },

      { esCorrecta: false, texto: " x es correcto" },//4
      { esCorrecta: true, texto: " x es incorrecto" },

      { esCorrecta: true, texto: "40" },//5.
      { esCorrecta: false, texto: "50" },

      { esCorrecta: true, texto: "120Bs" },//6.
      { esCorrecta: false, texto: "100Bs" },

      { esCorrecta: false, texto: "800Bs" },//7.
      { esCorrecta: true, texto: "89Bs" },

      { esCorrecta: true, texto: " x es correcto" },//8.
      { esCorrecta: false, texto: " x es incorrecto" },
      // vvv
      { esCorrecta: false, texto: "30 preguntas" },//9.
      { esCorrecta: true, texto: "40 preguntas" },

      { esCorrecta: false, texto: "14Bs" },//10.
      { esCorrecta: true, texto: "11Bs" },

      { esCorrecta: false, texto: "1090Bs" },//11.
      { esCorrecta: true, texto: "2000Bs" },

      { esCorrecta: false, texto: "90%" },//12
      { esCorrecta: true, texto: "60%" },
      //Leccion2
      { esCorrecta: true, texto: "es correcto" },//1
      { esCorrecta: false, texto: "es incorrecto" },
      { esCorrecta: true, texto: "es correcto" },//2
      { esCorrecta: false, texto: "es incorrecto" },
      { esCorrecta: true, texto: "es correcto" },//3
      { esCorrecta: false, texto: "es incorrecto" },
      { esCorrecta: true, texto: "es incorrecto" },//4
      { esCorrecta: false, texto: "es correcto" },
      { esCorrecta: true, texto: "es correcto" },//5
      { esCorrecta: false, texto: "es incorrecto" },
      { esCorrecta: true, texto: "es correcto" },//6
      { esCorrecta: false, texto: "es incorrecto" },
      { esCorrecta: true, texto: "es incorrecto" },//7
      { esCorrecta: false, texto: "es correcto" },
      { esCorrecta: true, texto: "es correcto" },//8
      { esCorrecta: false, texto: "es incorrecto" },
      { esCorrecta: true, texto: "si todos" },//9
      { esCorrecta: false, texto: "no todos" },
      { esCorrecta: true, texto: "si, comunmente las leyes tributarias crean ciertas excepciones en el pago de algunos impuestos." },//10
      { esCorrecta: false, texto: "no, existen excepciones" },
      { esCorrecta: true, texto: "ingresos de derecho público​" },//11
      { esCorrecta: false, texto: "ingresos de derecho privado" },
      { esCorrecta: true, texto: "actividades del Estado" },//12
      { esCorrecta: false, texto: "gastos privados" },
      { esCorrecta: true, texto: "6" },//13
      { esCorrecta: false, texto: "2" },
      { esCorrecta: true, texto: "si" },//14
      { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" },//15
      { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "una descripcion correcta" },//16
      { esCorrecta: false, texto: "una descripcion incorrecta" },
      { esCorrecta: true, texto: "No" },//17
      { esCorrecta: false, texto: "Si" },
      { esCorrecta: false, texto: "Personas que realizan actividades económicas." },//18
      { esCorrecta: true, texto: "No se contempla esta opción(NINGUNO)." },
      { esCorrecta: true, texto: "el enunciado es cierto." },//19X
      { esCorrecta: false, texto: "el enunciado es incorrecto" },
      { esCorrecta: true, texto: "una descripcion correcta" },//20
      { esCorrecta: false, texto: "una descripcion incorrecta" },
      { esCorrecta: true, texto: "si" },//21
      { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "4" },//22
      { esCorrecta: false, texto: "7" },
      { esCorrecta: true, texto: "Impuesto,Tasas,Contribuciones Especiales y Patentes" },//23
      { esCorrecta: false, texto: "Impuesto" },
      { esCorrecta: true, texto: "si" },//24
      { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" },//25
      { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" },//26
      { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" },//27
      { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "cierto" },//28
      { esCorrecta: false, texto: "falso" },
      { esCorrecta: true, texto: "cierto" },//29
      { esCorrecta: false, texto: "falso" },

      //Leccion 3
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "cierto" }, { esCorrecta: false, texto: "falso" },
      { esCorrecta: true, texto: "Impuesto al Valor Agregado - IVA" }, { esCorrecta: false, texto: "Impuesto a las Transacciones (IT)" },
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "cierto" }, { esCorrecta: false, texto: "falso" },
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "si" }, { esCorrecta: false, texto: "no" },
      { esCorrecta: true, texto: "Régimen Tributario Simplificado(RTS)" },
      { esCorrecta: false, texto: "Régimen Tributario Singular(RTS)" },
      { esCorrecta: true, texto: "13.0" },
      { esCorrecta: false, texto: "13.5" },
      { esCorrecta: true, texto: "15.6" },
      { esCorrecta: false, texto: "17" },
      { esCorrecta: true, texto: "19.5" },
      { esCorrecta: false, texto: "19.0" },
      { esCorrecta: true, texto: "26.0" },
      { esCorrecta: false, texto: "21.0" },
      { esCorrecta: true, texto: "10" },
      { esCorrecta: false, texto: "11" },
      { esCorrecta: true, texto: "18" },
      { esCorrecta: false, texto: "17" },
      { esCorrecta: true, texto: "21" },
      { esCorrecta: false, texto: "20" },
      { esCorrecta: true, texto: "58" },
      { esCorrecta: false, texto: "57" },
      { esCorrecta: true, texto: "22" },
      { esCorrecta: false, texto: "21" },
    ]
    const indxPreguntas1 = nuevasPreguntasEtapa1.map(item => item.id)

    let idxRes = 0
    let nrespuestasEtapa1: any = []
    for (let index = 0; index < indxPreguntas1.length; index++) {
      nrespuestasEtapa1.push(
        new Respuesta({
          idPregunta: indxPreguntas1[index],
          texto: respuestasEtapa1[idxRes].texto,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          esCorrecta: respuestasEtapa1[idxRes]?.esCorrecta,
          usuarioCreacion: USUARIO_SISTEMA,
        })
      )
      idxRes++;
      nrespuestasEtapa1.push(
        new Respuesta({
          idPregunta: indxPreguntas1[index],
          texto: respuestasEtapa1[idxRes].texto,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          esCorrecta: respuestasEtapa1[idxRes]?.esCorrecta,
          usuarioCreacion: USUARIO_SISTEMA,
        })
      )
      idxRes++;
    }
    await queryRunner.manager.save(nrespuestasEtapa1)
    ////////////////////ETAPA 2

    const items2 = [
      //Leccion 4
      {
        idLeccion: 4,
        texto: "Tu depositas 167bs en Fondo Creciente, te garantiza un rendimiento del 27% mensual, si retiras tu deposito 9 meses despues ¿Cuánto recibe?.",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 471bs en Fondo Solar, te garantiza un rendimiento del 22% mensual, si retiras tu deposito 4 meses despues ¿Cuánto recibe?.",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 256bs en Inversión Azul, te garantiza un rendimiento del 67% mensual, si retiras tu deposito 4 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 118bs en Capital Raíz, te garantiza un rendimiento del 63% mensual, si retiras tu deposito 11 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 148bs en Horizonte Verde, te garantiza un rendimiento del 81% mensual, si retiras tu deposito 2 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 140bs en Tesoro Digital, te garantiza un rendimiento del 10% mensual, si retiras tu deposito 4 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 109bs en Ola Tecnológica, te garantiza un rendimiento del 31% mensual, si retiras tu deposito 9 meses despues ¿Cuánto recibe?.",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 222bs en Cumbre Empresarial, te garantiza un rendimiento del 79% mensual, si retiras tu deposito 6 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 147bs en Fondo Galáctico, te garantiza un rendimiento del 83% mensual, si retiras tu deposito 2 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 318bs en EcoSostenible, te garantiza un rendimiento del 32% mensual, si retiras tu deposito 6 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 419bs en Nexo Global, te garantiza un rendimiento del 28% mensual, si retiras tu deposito 1 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 408bs en Cápsula del Tiempo, te garantiza un rendimiento del 93% mensual, si retiras tu deposito 8 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 200bs en Fuego Artificial, te garantiza un rendimiento del 49% mensual, si retiras tu deposito 11 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 280bs en Mar de Innovación, te garantiza un rendimiento del 81% mensual, si retiras tu deposito 7 meses despues ¿Cuánto recibe?",
      },
      {
        idLeccion: 4,
        texto: "Tu depositas 348bs en Vórtice Financiero, te garantiza un rendimiento del 84% mensual, si retiras tu deposito 9 meses despues ¿Cuánto recibe?",
      },
      // Leccion 5
      { idLeccion: 5, texto: 'Tu depositas 194bs en el Fondo Bienestar Integral que garantiza un rendimiento del 71% anual, si la persona retira su deposito 37 dias despues ¿Cuánto recibe?.' },
      { idLeccion: 5, texto: 'Tu depositas 108bs en el Fondo Vitalidad Solar que garantiza un rendimiento del 61% anual, si la persona retira su deposito 24 dias despues ¿Cuánto recibe?.' },
      { idLeccion: 5, texto: 'Tu depositas 271bs en el Fondo Corazón Azul que garantiza un rendimiento del 76% anual, si la persona retira su deposito 41 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 128bs en el Fondo Raíz Vital que garantiza un rendimiento del 85% anual, si la persona retira su deposito 37 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 281bs en el Fondo Horizonte Saludable que garantiza un rendimiento del 55% anual, si la persona retira su deposito 31 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 161bs en el Fondo Innovación Médica que garantiza un rendimiento del 28% anual, si la persona retira su deposito 33 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 204bs en el Fondo Avance Biotecnológico que garantiza un rendimiento del 8% anual, si la persona retira su deposito 42 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 177bs en el Fondo Cumbre Sanitaria que garantiza un rendimiento del 100% anual, si la persona retira su deposito 36 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 252bs en el Fondo Exploración Genética que garantiza un rendimiento del 47% anual, si la persona retira su deposito 34 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 228bs en el Fondo EcoTerapia que garantiza un rendimiento del 77% anual, si la persona retira su deposito 42 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 290bs en el Fondo Conexión Mindfulness que garantiza un rendimiento del 65% anual, si la persona retira su deposito 45 dias despues ¿Cuánto recibe?.' },
      { idLeccion: 5, texto: 'Tu depositas 240bs en el Fondo Memoria Celular que garantiza un rendimiento del 73% anual, si la persona retira su deposito 37 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 126bs en el Fondo Impulso Nutricional que garantiza un rendimiento del 30% anual, si la persona retira su deposito 26 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 246bs en el Fondo Océano Terapéutico que garantiza un rendimiento del 40% anual, si la persona retira su deposito 27 dias despues ¿Cuánto recibe?' },
      { idLeccion: 5, texto: 'Tu depositas 222bs  en el Fondo Espirales de Salud que garantiza un rendimiento del 75% anual, si la persona retira su deposito 30 dias despues ¿Cuánto recibe?' },
      // Leccion 6
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 180Bs al 61% mensual en 2 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 271Bs al 19% mensual en 4 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 155Bs al 30% mensual en 12 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 282Bs al 17% mensual en 12 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 164Bs al 62% mensual en 3 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 103Bs al 16% mensual en 9 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 180Bs al 89% mensual en 3 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 127Bs al 19% mensual en 6 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 166Bs al 65% mensual en 11 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 249Bs al 20% mensual en 11 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda Conexión Mindfulness simple mensual produces en un capital de 259Bs al 65% mensual en 4 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de interes Memoria Celular simple mensual produces en un capital de 120Bs al 52% mensual en 12 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda Impulso Nutricional simple mensual produces en un capital de 202Bs al 24% mensual en 11 meses?' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de interes Océano Terapéutico simple mensual produces en un capital de 110Bs al 78% mensual en 2 meses?.' },
      { idLeccion: 6, texto: '¿Qué cantidad por concepto de deuda Espirales de Salud simple mensual produces en un capital de 182Bs al 88% mensual en 7 meses?' },
      //Leccion 7
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 163Bs al 68% anual en 12 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 152Bs al 45% anual en 12 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 202Bs al 85% anual en 2 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 159Bs al 64% anual en 3 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 292Bs al 23% anual en 5 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 227Bs al 30% anual en 11 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 262Bs al 13% anual en 7 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 134Bs al 65% anual en 8 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda simple mensual produces en un capital de 257Bs al 49% anual en 6 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de interes simple mensual produces en un capital de 286Bs al 50% anual en 11 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda Conexión Mindfulness simple mensual produces en un capital de 283Bs al 87% anual en 2 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de interes Memoria Celular simple mensual produces en un capital de 231Bs al 21% anual en 12 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda Impulso Nutricional simple mensual produces en un capital de 144Bs al 48% anual en 11 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de interes Océano Terapéutico simple mensual produces en un capital de 208Bs al 26% anual en 11 meses?' },
      { idLeccion: 7, texto: '¿Qué cantidad por concepto de deuda Espirales de Salud simple mensual produces en un capital de 262Bs al 56% anual en 3 meses?' },
    ]
    const preguntasEtapa2 = items2.map((item) => {
      return new Pregunta({
        idLeccion: item.idLeccion?.toString(),
        texto: item.texto,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    const nuevasPreguntasEtapa2 = await queryRunner.manager.save(preguntasEtapa2)
    const respuestasEtapa2 = [
      // Leccion4
      {
        esCorrecta: true,
        texto: '572'
      },
      {
        esCorrecta: true,
        texto: '885'
      },
      {
        esCorrecta: true,
        texto: '942'
      },
      {
        esCorrecta: true,
        texto: '935'
      },
      {
        esCorrecta: true,
        texto: '387'
      },
      {
        esCorrecta: true,
        texto: '196'
      },
      {
        esCorrecta: true,
        texto: '413'
      },
      {
        esCorrecta: true,
        texto: '1274'
      },
      {
        esCorrecta: true,
        texto: '391'
      },
      {
        esCorrecta: true,
        texto: '928'
      },
      {
        esCorrecta: true,
        texto: '536'
      },
      {
        esCorrecta: true,
        texto: '3443'
      },
      {
        esCorrecta: true,
        texto: '1278'
      },
      {
        esCorrecta: true,
        texto: '1867'
      },
      {
        esCorrecta: true,
        texto: '2978'
      },
      // Leccion5
      { texto: '207' },
      { texto: '112' },
      { texto: '294' },
      { texto: '139' },
      { texto: '294' },
      { texto: '165' },
      { texto: '205' },
      { texto: '194' },
      { texto: '263' },
      { texto: '248' },
      { texto: '313' },
      { texto: '257' },
      { texto: '128' },
      { texto: '253' },
      { texto: '235' },
      //Leccion6
      { texto: '109' },
      { texto: '205' },
      { texto: '558' },
      { texto: '575' },
      { texto: '305' },
      { texto: '148' },
      { texto: '480' },
      { texto: '144' },
      { texto: '1186' },
      { texto: '547' },
      { texto: '673' },
      { texto: '748' },
      { texto: '533' },
      { texto: '171' },
      { texto: '1121' },
      //Leccion7
      { texto: '110' },
      { texto: '68' },
      { texto: '28' },
      { texto: '25' },
      { texto: '27' },
      { texto: '62' },
      { texto: '19' },
      { texto: '58' },
      { texto: '62' },
      { texto: '131' },
      { texto: '41' },
      { texto: '48' },
      { texto: '63' },
      { texto: '49' },
      { texto: '36' },
    ]

    const nrespuestasEtapa2 = nuevasPreguntasEtapa2.map((item, indx) => {
      return new Respuesta({
        idPregunta: item.id,
        texto: respuestasEtapa2[indx].texto,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        esCorrecta: respuestasEtapa2[indx]?.esCorrecta ?? true,
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(nrespuestasEtapa2)
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
