// import { CategoryFilter } from "@/components/CategoryFilter";
// import EventCard from "@/components/EventCard";
// import { LocationFilter } from "@/components/LocationFilter";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import React from "react";

// const Event = async () => {
//    // Fetch data dari backend
//    const res = await fetch("http://localhost:3000/events", {
//     cache: "no-store", // Biar selalu ambil data terbaru

//     const data = await res.json();
//   });
//   return (
//     <section className="w-full py-12 md:py-24 lg:py-32">
//       <div className="container px-4 md:px-6">
//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight">
//               Upcoming Events
//             </h2>
//             <p className="text-muted-foreground">
//               Discover events happening soon
//             </p>
//           </div>
//           <div className="flex flex-col gap-2 sm:flex-row">
//             <CategoryFilter />
//             <LocationFilter />
//           </div>
//         </div>
//         <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {data.map((event: any, key:number) => (
  //             <EventCard
  //               id={event.id}
  //               title={event.title}
  //               date={event.startDate}
  //               location={event.location}
  //               price={event.price}
  //               image={event.image}
  //               category={event.category}
  //             />
  //           ))}
  //         </div>
  //         <div className="mt-10 flex justify-center">
  //           <Button asChild>
  //             <Link href="/browsers">View All Events</Link>
  //           </Button>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // };
  
  // export default Event;


  
import { CategoryFilter } from "@/components/CategoryFilter";
import EventCard from "@/components/EventCard";
import { LocationFilter } from "@/components/LocationFilter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Event = async () => {
  // Fetch data dari backend
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store", // Biar selalu ambil data terbaru
  });
  const data = await res.json();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
            <p className="text-muted-foreground">Discover events happening soon</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <CategoryFilter />
            <LocationFilter />
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((event: any) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.startDate}
              location={event.location}
              price={event.price}
              image={event.image}
              category={event.category}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link href="/browsers">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Event;
