import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React Meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />{" "}
    </>
  );
};

// to regenerate page for every incoming requests
// dynamically
// this function will not run during build process instead
// it will always run on server after deployement
// NEVER in the client side

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// getStaticProps this name is reserved, if nextJs sees this
// named function, it executes it first, it can be async too :)
// IMP getStaticProps, it updates the build regularly even
// after deployement after every revalidate seconds

export async function getStaticProps() {
  // fetch data from an api
  // always return a object

  const client = await MongoClient.connect(
    "mongodb+srv://kedarvyas02:vq3ynmYQOA25kX3o@kedarvyas.zyajmw7.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    // revalidate: 10,
  };
}

export default HomePage;
