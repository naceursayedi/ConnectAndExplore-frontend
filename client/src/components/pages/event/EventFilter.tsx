import { MouseEvent, useEffect, useState } from "react";
import { eventsResource } from "../../../Resources";
import { getAllEvents, searchEvents } from "../../../backend/boardapi";
import { Link } from "react-router-dom";
import Button from "../../html/Button";
import Container from "../../Container";
import Event from "../../landingPage/Event";

export type EventFilterProps = {
  //setQuery: (query:string) => void;
  query: string;
  //setPLZ: (plz:string) => void;
  plz: string;
};
export default function EventFilter({ query, plz }: EventFilterProps) {
  //const [query, setQuery] = useState<string | null>(null);
  const [events, setEvents] = useState<eventsResource | null>(null);
  //const [plz, setPLZ] = useState<string | null>(null);

  const load = async () => {
    console.log("did change?");
    if (query == "" || !query) {
      try {
        console.log("gets all events!");
        const events: eventsResource = await getAllEvents();
        events.events = events.events.filter((event) => {
          if (!plz) {
            return true;
          }
          return event.address.postalCode.includes(plz);
        });
        setEvents(events);
      } catch (err) {
        console.log(err);
        setEvents(null);
      }
    } else {
      console.log("query: ", query);
      console.log("plz: ", plz);
      try {
        const events: eventsResource = await searchEvents(query);
        events.events = events.events.filter((event) => {
          if (!plz) {
            return true;
          }
          return event.address.postalCode.includes(plz);
        });
        setEvents(events);
      } catch (err) {
        console.log(err);
        setEvents(null);
      }
    }
  };

  useEffect(() => {
    load();
  }, [query, plz]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState("hidden");
  const [switchCategory, setSwitchCategory] = useState(false);
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEventsData = await getAllEvents();
        let filteredEvents = allEventsData.events;
        if (selectedCategory !== "/") {
          filteredEvents = allEventsData.events.filter(
            (event) =>
              event.category &&
              event.category.some(
                (category) => category.name === selectedCategory
              )
          );
          if (selectedCategory === "") setEvents(allEventsData);
          else setEvents({ events: filteredEvents });
        } else if (selectedDate !== "") {
          filteredEvents = allEventsData.events.filter(
            (event) => JSON.stringify(event.date).slice(1, 11) === selectedDate
          );
          setEvents({ events: filteredEvents });
        }
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      }
    };

    fetchData();
  }, [selectedCategory, selectedDate, switchCategory]);

  useEffect(() => {
    window.addEventListener("resize", handleMobile);
  }, []);

  const handleMobile = () => {
    if (window.innerWidth < 414) setMobile("text-center");
    else setMobile("");
  };

  const handleFilterByCategory = (category: string) => {
    setSelectedCategory(category);
    setSwitchCategory(!switchCategory);
    setSelectedDate("");
    if (window.innerWidth < 414) setHidden("hidden");
  };

  const handleFilterByDate = (date: string) => {
    setSelectedDate(date);
    setSelectedCategory("/");
    if (window.innerWidth < 414) setHidden("hidden");
  };

  const handleActive = () => {
    if (hidden == "hidden") setHidden("");
    else if (hidden == "") setHidden("hidden");
  };

  return (
    <>
      <Container>
        <input
          className={`inline-block w-36 px-2 py-4`}
          type="date"
          value={selectedDate || ""}
          onChange={(e) => handleFilterByDate(e.target.value)}
        />
        <div className={`${mobile}`}>
          <div className={`inline-block w-36 px-2 py-4`}>
            <Button label={"Filter"} onClick={handleActive}></Button>
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Alle Events"
              onClick={() => handleFilterByCategory("")}
            />
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Kultur & Kunst"
              onClick={() => handleFilterByCategory("Kultur & Kunst")}
            />
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Konzert"
              onClick={() => handleFilterByCategory("Konzert")}
            />
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Sport & Fitness"
              onClick={() => handleFilterByCategory("Sport & Fitness")}
            />
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Gaming"
              onClick={() => handleFilterByCategory("Gaming")}
            />
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Hobbys"
              onClick={() => handleFilterByCategory("Hobbys")}
            />
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Outdoor"
              onClick={() => handleFilterByCategory("Outdoor")}
            />
          </div>
          <div className={`inline-block w-36 px-2 py-4 ${hidden}`}>
            <Button
              label="Social"
              onClick={() => handleFilterByCategory("Social")}
            />
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {events && events.events && events.events.length !== 0 ? (
          <>
            <div
              className="
                       grid
                       grid-cols-1
                       sm:grid-cols-2
                       md:grid-cols-3
                       lg:grid-cols-4
                       gap-8
                   "
            >
              {events.events.map((event, index) => (
                <Link to={`/event/${event.id}`} key={index}>
                  <Event
                    key={index}
                    id={event.id}
                    address={event.address}
                    date={event.date}
                    name={event.name}
                    description={event.description}
                    hashtags={event.hashtags}
                    category={event.category?.map((category) => category.name)}
                  />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <>
            <br />
            <p>keine Events gefunden</p>
          </>
        )}
      </Container>
    </>
  );
}
