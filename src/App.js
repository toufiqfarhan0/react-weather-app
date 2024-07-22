import { useEffect, useState } from 'react'
import TodayDisplay from './components/TodayDisplay'
import Card from './components/Card'
import UnitContainer from './components/UnitContainer'

const App = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [unit, setUnit] = useState('celcius')

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Location API is not supported by your browser')
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords)
        },
        () => {
          setError('Sorry, we cannot find your location')
        }
      )
    }
  }

  const fetchData = () => {
    const latitude = location?.latitude
    const longitude = location?.longitude
    fetch(
      `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    getLocation()
    fetchData()
  }, [])

  const handleClick = (e) => {
    setUnit(e.target.id)
  }

  return (
    <div className="weather-app">
      <TodayDisplay today={data?.dataseries[0]} location={location} />
      <div className="cards-container">
        {data?.dataseries.map((day, index) => (
          <Card key={index} day={day} index={index} unit={unit} />
        ))}
      </div>
      <UnitContainer handleClick={handleClick} unit={unit} />
      {error}
    </div>
  )
}

export default App
