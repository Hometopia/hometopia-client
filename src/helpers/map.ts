const extractLatLng = (url: string) => {
  // Kiểm tra nếu URL chứa '3d' và '4d'
  const latLngMatch = url.match(/@?([\d.-]+),([\d.-]+)/)

  if (latLngMatch) {
    const latitude = parseFloat(latLngMatch[1])
    const longitude = parseFloat(latLngMatch[2])
    return { latitude, longitude }
  }

  // Dùng cách khác nếu URL có dạng khác
  const altLat = url.match(/!3d([\d.-]+)!4d([\d.-]+)/)
  if (altLat) {
    const latitude = parseFloat(altLat[1])
    const longitude = parseFloat(altLat[2])
    return { latitude, longitude }
  }

  throw new Error("Không tìm thấy tọa độ trong URL.");
}

export { extractLatLng }