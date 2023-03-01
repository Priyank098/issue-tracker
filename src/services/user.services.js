const validatingFields = (title, description, priority) => {
    if (!title || !description || !priority) {
        throw new Error("Title , Description and priority should be valid", {
            cause: { status: 400 }
        })
    }
}
const update_issue_helper = (updateIssue, res) => {
    if (!updateIssue) {
        throw new Error("Data not updated Please try again later")
    } else {
        res.status(201).json({
            success: true,
            data: updateIssue
        })
    }
}

const update_issue = async (req, res, Issue, assignUserData, previousAssignUserData, Status) => {
    if (assignUserData && Status) {
        const updateIssue = await Issue.findByIdAndUpdate(req.params.id, { ...req.body, status: Status.values[1] }, {
            new: true, runValidators: true
        });
        await assignUserData.updateCount()
        update_issue_helper(updateIssue, res)
    }
    else if (previousAssignUserData && assignUserData) {
        const updateIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        await previousAssignUserData.updateCount()
        await assignUserData.updateCount()
        update_issue_helper(updateIssue, res)

    } else if (!assignUserData && !previousAssignUserData && !Status) {
        const updateIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        update_issue_helper(updateIssue, res)
    }
}

module.exports = { validatingFields, update_issue, update_issue_helper }