import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        title={props.meetupData.title}
        image={props.meetupData.image}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

// if the page is a dynamic page and if we use getStaticProps,
// we have to compulsorily make a getStaticPaths function
// now why it is required, as there could be several meetupId's
// and this page is gonna be static, so nextJs would have to generate
// static pages for all the possible id's, so to overcome un-needed id's
// static page generation, we give it here in getStaticPaths, so whatever
// id's we mention here, it will generate static pages for it :)

// about fallback, if we set it to false, it means that we have mentioned
// all the possible paths that are needed to be mentioned for nextJs to
// make html pages for, so if user requests a path which is not mentioned
// from the given below paths, it will return a 404 page of not found
// However, if we set it to true, it will generate a dynamic page on it's own
// it means that if we want to generate only some of the popular requested pages
// instead of all pages, and don't want to make server a li'l slow, we can set
// fallback to true, and it will generate it dynamically when user requests it
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://kedarvyas02:vq3ynmYQOA25kX3o@kedarvyas.zyajmw7.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://kedarvyas02:vq3ynmYQOA25kX3o@kedarvyas.zyajmw7.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
