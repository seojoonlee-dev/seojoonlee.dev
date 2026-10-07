export default function Section({ name } : { name: string }) {
  return(
    <>
        <div className="border">
            <p style={{fontWeight: "bold"}} className="section">{name}</p><hr />
        </div>
    </>
  )
}
