const menu = () => {

    return (
        <>
            <section className="max-w-[520px] mx-auto grid grid-cols-2 gap-4 p-4">

                {/* Card 1 */}
                <article className="bg-white rounded-xl p-3 shadow border">
                    <img 
                        src="https://via.placeholder.com/150" 
                        className="w-full h-28 object-cover rounded-lg"
                    />
                    <h1 className="text-sm font-semibold mt-2">Spicy Noodles</h1>
                    <p className="text-orange-600 font-bold text-sm">₱150</p>
                </article>

                {/* Card 2 */}
                <article className="bg-white rounded-xl p-3 shadow border">
                    <img 
                        src="https://via.placeholder.com/150" 
                        className="w-full h-28 object-cover rounded-lg"
                    />
                    <h1 className="text-sm font-semibold mt-2">Shrimp Pasta</h1>
                    <p className="text-orange-600 font-bold text-sm">₱180</p>
                </article>

                {/* Card 3 */}
                <article className="bg-white rounded-xl p-3 shadow border">
                    <img 
                        src="https://via.placeholder.com/150" 
                        className="w-full h-28 object-cover rounded-lg"
                    />
                    <h1 className="text-sm font-semibold mt-2">Vegetable Curry</h1>
                    <p className="text-orange-600 font-bold text-sm">₱120</p>
                </article>

                {/* Card 4 */}
                <article className="bg-white rounded-xl p-3 shadow border">
                    <img 
                        src="https://via.placeholder.com/150" 
                        className="w-full h-28 object-cover rounded-lg"
                    />
                    <h1 className="text-sm font-semibold mt-2">Mixed Salad</h1>
                    <p className="text-orange-600 font-bold text-sm">₱150</p>
                </article>

                {/* Card 5 */}
                <article className="bg-white rounded-xl p-3 shadow border">
                    <img 
                        src="https://via.placeholder.com/150" 
                        className="w-full h-28 object-cover rounded-lg"
                    />
                    <h1 className="text-sm font-semibold mt-2">Chicken Pasta Salad</h1>
                    <p className="text-orange-600 font-bold text-sm">₱150</p>
                </article>

                {/* Card 6 */}
                <article className="bg-white rounded-xl p-3 shadow border">
                    <img 
                        src="https://via.placeholder.com/150" 
                        className="w-full h-28 object-cover rounded-lg"
                    />
                    <h1 className="text-sm font-semibold mt-2">Beef Salad</h1>
                    <p className="text-orange-600 font-bold text-sm">₱120</p>
                </article>

            </section>
        </>
    )
}

export default menu;


// day 1 - fix pull request