import Image from "next/image";
import Link from "next/link";
export default function Home() {
    return (
        <section className="text-gray-600 body-font">
            <div className="max-w-7xl mx-auto flex px-5 lg:flex-row flex-col justify-center items-center">
                <div className="lg:flex-grow lg:w-1/2 lg:ml-24 pt-6 flex flex-col lg:items-start lg:text-left mb-0 lg:mb-40 items-center text-center">
                    <h1 className="mb-5 font-semibold text-[2.3rem] leading-[2.7rem] md:text-5xl items-center Avenir xl:w-2/2 text-gray-900">
                        Fleet Management Made Easy
                    </h1>
                    <p className="mb-4 w-full xl:w-3/4 text-gray-600 text-[1.2rem] md:text-lg">
                        Vehitrak simplifies the fleet management process from
                        maintenance tracking to real time driver updates.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/login" className="btn btn-primary">
                            Sign Up Now
                        </Link>
                    </div>
                </div>
                <div className="scale-75 xl:mr-32 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-0 lg:mr-28 lg:pl-10">
                    <div className="mockup-phone">
                        <div className="camera"></div>
                        <div className="display h-[8in]">
                            <div className="artboard h-full artboard-demo phone-4">
                                <Image
                                    src="/dashboard-phone.png"
                                    width="600"
                                    height="600"
                                    className="-translate-y-14"
                                    alt="Dashboard on the phone mockup"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto flex lg:gap-20 px-5 lg:flex-row-reverse flex-col justify-center">
                <div className="lg:flex-grow md:mr-0 pt-20 flex flex-col lg:items-start lg:text-left mb-20 items-center text-center">
                    <h1 className="mb-5 font-semibold text-4xl md:text-5xl items-center Avenir xl:w-2/2 text-gray-900">
                        Everything In One Place
                    </h1>
                    <p className="mb-4 w-3/4 text-gray-600 text-lg">
                        View all your vehicles' metrics, past maintenance logs,
                        and more all in one place!
                    </p>
                    <div className="flex justify-center">
                        {/* <Link href="/login" className="btn btn-primary">
                            Login
                        </Link> */}
                    </div>
                </div>

                <div className="sm:mr-0 scale-90 lg:scale-100 sm:mb-28 mx-auto ">
                    <Image
                        src="/mockup-ipad.png"
                        width="900"
                        height="900"
                        alt="ipad mockup of the dashboard"
                    />
                </div>
            </div>

            <div className="flex flex-col items-center mb-12 max-w-7xl pt-20 mx-auto text-center">
                <h1 className="mb-8 text-4xl mx-2 md:text-5xl font-semibold text-gray-900">
                    We'd love to get your input!
                </h1>
                <h1 className="mb-8 text-xl w-10/12 Avenir  text-gray-600 text-center">
                    We are still in beta so we are constantly iterating and
                    improving our product. Your input would allow us to build
                    the best possible product for solving any problems you have
                    in managing your fleet of vehicles
                </h1>
                <p>
                    Send us a email at{" "}
                    <strong>mooonwishstudios@gmail.com</strong> or call us at{" "}
                    <strong>(714) 330-9387</strong>
                </p>
            </div>
        </section>
    );
}
