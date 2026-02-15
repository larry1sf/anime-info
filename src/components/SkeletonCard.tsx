export default function SkeletonCard() {
	return (
		<article className="bg-gray-200 rounded-2xl overflow-hidden shadow-md flex flex-col">
			<div className="relative overflow-hidden h-64 shrink-0">
				<div className="absolute inset-0 animate-pulse bg-gray-300" />
			</div>
			<div className="p-4 flex flex-col space-y-3">
				<div className="h-5 bg-gray-300 rounded animate-pulse" />
				<div className="space-y-2">
					<div className="h-4 bg-gray-300 rounded animate-pulse" />
					<div className="h-4 bg-gray-300 rounded animate-pulse w-3/4" />
				</div>
				<div className="flex justify-between pt-2">
					<div className="h-4 w-12 bg-gray-300 rounded animate-pulse" />
					<div className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
				</div>
			</div>
		</article>
	)
}
