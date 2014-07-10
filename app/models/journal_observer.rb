#-- encoding: UTF-8
#-- copyright
# ChiliProject is a project management system.
#
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# See doc/COPYRIGHT.rdoc for more details.
#++

class JournalObserver < ActiveRecord::Observer
  attr_accessor :send_notification
  attr_accessor :send_as_initial
  attr_accessor :send_without_default_block
  attr_accessor :custom_message
  attr_accessor :custom_message_suffix

  def after_create(journal)
    case journal.type
    when "IssueJournal"
      if !journal.initial? && send_notification
        after_create_issue_journal(journal)
      end
    when "WikiContentJournal"
      wiki_content = journal.journaled
      wiki_page = wiki_content.page

      if journal.initial?
        if Setting.notified_events.include?('wiki_content_added')
          (wiki_content.recipients + wiki_page.wiki.watcher_recipients).uniq.each do |recipient|
            Mailer.deliver_wiki_content_added(wiki_content, recipient)
          end
        end
      else
        if Setting.notified_events.include?('wiki_content_updated')
          (wiki_content.recipients + wiki_page.wiki.watcher_recipients + wiki_page.watcher_recipients).uniq.each do |recipient|
            Mailer.deliver_wiki_content_updated(wiki_content, recipient)
          end
        end
      end
    end
    clear_notification
    clear_initial
    clear_without_default_block
    clear_custom
    clear_custom_suffix
  end

  def after_create_issue_journal(journal)
    if Setting.notified_events.include?('issue_updated') ||
        (Setting.notified_events.include?('issue_note_added') && journal.notes.present?) ||
        (Setting.notified_events.include?('issue_status_updated') && journal.new_status.present?) ||
        (Setting.notified_events.include?('issue_priority_updated') && journal.new_value_for('priority_id').present?)
      issue = journal.issue
      (issue.recipients + issue.watcher_recipients).uniq.each do |recipient|
        Mailer.deliver_issue_edit(journal, recipient, custom_message, custom_message_suffix, send_as_initial, send_without_default_block)
      end
    end
  end

  # Wrap send_notification so it defaults to true, when it's nil
  def send_notification
    return true if @send_notification.nil?
    return @send_notification
  end

  def send_as_initial
    return false if @send_as_initial.nil?
    return @send_as_initial
  end

  def send_without_default_block
    return false if @send_without_default_block.nil?
    return @send_without_default_block
  end

  def custom_message
    return "" if @custom_message.nil?
    return @custom_message
  end

  def custom_message_suffix
    return "" if @custom_message_suffix.nil?
    return @custom_message_suffix
  end

  private

  # Need to clear the notification setting after each usage otherwise it might be cached
  def clear_notification
    @send_notification = true
  end

  def clear_initial
    @send_as_initial = false
  end

  def clear_without_default_block
    @send_without_default_block = false
  end

  def clear_custom
    @custom_message = ""
  end

  def clear_custom_suffix
    @custom_message_suffix = ""
  end

end
