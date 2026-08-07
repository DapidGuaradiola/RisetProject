export default async function videos() {
  type videoType = {
    video_id: number;
    title: string;
  };
  const data = await fetch("http://backend:3000/video");
  const video: videoType[] = await data.json();
  return (
    <>
      <table className="border-collapse border border-spacing-2 table-fixed my-auto mx-auto">
        <thead className="border border-gray-400 px-4 py-2">
          <tr>
            <th>Video ID</th>
            <th>title</th>
          </tr>
        </thead>
        <tbody>
          {video.map((m) => (
            <tr key={m.video_id}>
              <td className="border-collapse border-gray-400 px-4 py-2">
                {m.video_id}
              </td>
              <td className="border-collapse border-gray-400 px-4 py-2">
                {m.title}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
