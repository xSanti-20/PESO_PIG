import PublicNav from "@/components/nav/PublicNav";

const UserManual = () => {
  return (
    <>
      <PublicNav />
      <div className="flex flex-col items-center justify-center bg-gray-100  ">
        <h1 className="text-2xl font-bold text-gray-800 mb-11 m-9">Manual Usuario PESO PIG</h1>
        <div className="w-full max-w-4xl h-[120vh] bg-white shadow-lg rounded-lg overflow-hidden">
          <iframe
            src="/assets/docs/ManualT.pdf" // Ruta al archivo PDF dentro de la carpeta public
            width="100%"           // Establece el ancho del iframe al 100% del contenedor
            height="100%"          // Establece la altura del iframe al 100% del contenedor
            frameBorder="0"        // Elimina el borde del iframe
          ></iframe>
        </div>
      </div>
      <footer
        className="text-black py-4 mt-8 font-bold"
        style={{
          background: "linear-gradient(to right, var(--bg-color-rosado), var(--bg-color-primary))",
        }}
      >
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2024 PESO PIG. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default UserManual;
