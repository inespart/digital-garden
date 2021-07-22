import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Header username={props.username} />
      <div>{props.children}</div>
      <Footer />
    </>
  );
}
