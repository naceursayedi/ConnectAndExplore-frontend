'use client'

import Container from "../Container";
import Event from "../landingPage/Event";
import { eAddressResource, eventResource } from "../../Resources";
import { getAllEvents } from "../../backend/boardapi";
import { useEffect, useState } from "react";
import Button from "../html/Button";
import { Link } from "react-router-dom";


interface AllEventsProps {
     //events: { date: any, name: string, description: string, imageUrl?: string, hashtags?:string[],category?: string }[]
}

const initAddress:eAddressResource={
  street: "init",
  houseNumber: "init",
  postalCode: "init",
  city: "init",
  country: "init"
}
 
const initEvent:eventResource={
  name: "hahahaha",
  description: "init",
  price: -1,
  date: new Date(),
  address: initAddress,
  thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp4zpIuafwUwAALiZhyewnZPBfWlm8OvxZIEawUIuHKw&s"

}

const AllEvents: React.FC<AllEventsProps> = ({}) => {
    const [dbEvents,setDbEvents] = useState({events:[initEvent]});
    const [displayedEvents,setDisplayedEvents] = useState({events:[initEvent]});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const load=async ()=>{
      //let allDbEvents=await getAllEvents();
      //if(allDbEvents===-1)return
      setDbEvents(await getAllEvents())
      setDisplayedEvents(await getAllEvents())
    }

    useEffect(() => {
      // Hier wird der Filter angewendet, basierend auf der ausgewählten Kategorie
      if(selectedCategory===null){
        load()
      }
      const filteredEvents = dbEvents.events.filter(event =>
        event.category && event.category.some(category => category.name === selectedCategory)
      );
      console.log(filteredEvents)
      console.log(selectedCategory)
    
      // Setze den Zustand mit den gefilterten Events
      setDisplayedEvents({ events: filteredEvents });
    }, [selectedCategory]);
    
  
    const handleFilterByCategory = (category: string) => {
      setSelectedCategory(category);
    };
    
    return (
      <div className="flex font-sans bg-blue-500">
        <Container>
          <div className="grid grid-cols-6 overflow-x-scroll gap-5">
            <Button label="Events laden" onClick={load}/>
            {/* Buttons für Kategoriefilter */}
          <Button label="Kunst und Kultur" onClick={() => handleFilterByCategory('Kunst und Kultur')} />
          <Button label="Konzerte" onClick={() => handleFilterByCategory('Konzerte')} />
          <Button label="Sport und Fitness" onClick={() => handleFilterByCategory('Sport und Fitness')} />
          <Button label="Gaming" onClick={() => handleFilterByCategory('Gaming')} />
          <Button label="Hobbys" onClick={() => handleFilterByCategory('Hobbys')} />

            {displayedEvents.events.map((event, index) => (
              <div key={event.id} className="mb-8 mx-2">
                  <Link to={`/event/${event.id}`} key={event.id}>

                  <Event 
                    key={event.id}
                    address={event.address}
                    date={event.date}
                    name={event.name}
                    description={event.description}   
                    hashtags={event.hashtags}    
                  />
                  </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
    
  );
};

    
export default AllEvents;